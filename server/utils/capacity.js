/**
 * Capacity calculation utilities
 * Calculates available capacity for time slots based on active reservations
 */
const DEFAULT_BUSINESS_HOURS = {
  open: '17:00', // 5:00 PM
  close: '22:00' // 10:00 PM
};

export async function getDefaultRestaurant(prisma) {
  return prisma.restaurant.findFirst({
    where: { isActive: true },
    include: { settings: true },
  });
}

export async function getSlotCapacity(prisma, restaurantId, date, time) {
  const result = await prisma.reservation.aggregate({
    where: {
      restaurantId,
      reservationDate: date,
      reservationTime: time,
      status: { in: ['pending', 'confirmed'] },
    },
    _sum: { partySize: true },
  });
  return result._sum.partySize || 0;
}

export async function getDayCapacity(prisma, restaurantId, date) {
  const reservations = await prisma.reservation.findMany({
    where: {
      restaurantId,
      reservationDate: date,
      status: { in: ['pending', 'confirmed'] },
    },
    select: { reservationTime: true, partySize: true },
  });

  const slotMap = {};
  for (const r of reservations) {
    slotMap[r.reservationTime] = (slotMap[r.reservationTime] || 0) + r.partySize;
  }
  return slotMap;
}

export async function getBusinessWindow(prisma, restaurantId, date) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { settings: true }
  });
  
  if (!restaurant) return { isOpen: false, openTime: null, closeTime: null };
  
  const dayDate = new Date(date + 'T12:00:00-05:00');
  if (isNaN(dayDate.getTime())) return { isOpen: false, openTime: null, closeTime: null };
  const dayOfWeek = dayDate.getDay();
  
  const businessHour = await prisma.businessHours.findUnique({
    where: { restaurantId_weekday: { restaurantId, weekday: dayOfWeek } }
  });
  
  // 1. Priority: BusinessHours
  if (businessHour) {
    if (!businessHour.isOpen) return { isOpen: false, openTime: null, closeTime: null };
    return { isOpen: true, openTime: businessHour.openTime, closeTime: businessHour.closeTime };
  }
  
  // 2. Priority: RestaurantSettings
  if (restaurant.settings) {
    return { isOpen: true, openTime: restaurant.settings.defaultOpenTime, closeTime: restaurant.settings.defaultCloseTime };
  }
  
  // 3. Fallback
  return { isOpen: true, openTime: DEFAULT_BUSINESS_HOURS.open, closeTime: DEFAULT_BUSINESS_HOURS.close };
}

export async function getAvailableSlots(prisma, restaurantId, date) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { settings: true },
  });

  if (!restaurant || !restaurant.settings) return [];
  
  const window = await getBusinessWindow(prisma, restaurantId, date);
  if (!window.isOpen) return []; // Block completely if closed

  const { maxCapacityPerSlot } = restaurant.settings;
  const dayCapacity = await getDayCapacity(prisma, restaurantId, date);

  const slots = [];
  const openTimeStr = window.openTime;
  const closeTimeStr = window.closeTime;

  const [openH, openM] = openTimeStr.split(':').map(Number);
  const [closeH, closeM] = closeTimeStr.split(':').map(Number);

  let currentH = openH;
  let currentM = openM;

  while (currentH < closeH || (currentH === closeH && currentM <= closeM)) {
    const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
    const used = dayCapacity[timeStr] || 0;
    const available = maxCapacityPerSlot - used;

    // Check if slot allows reservation duration
    const slotDurationH = currentH + Math.floor((currentM + restaurant.settings.reservationDurationMinutes) / 60);
    const slotDurationM = (currentM + restaurant.settings.reservationDurationMinutes) % 60;
    
    // Only add slot if it finishes before or exactly at close time
    if (slotDurationH < closeH || (slotDurationH === closeH && slotDurationM <= closeM)) {
      slots.push({
        time: timeStr,
        used,
        available,
        maxCapacity: maxCapacityPerSlot,
        isFull: available <= 0,
        isFallback: false
      });
    }

    currentM += 30;
    if (currentM >= 60) {
      currentH += 1;
      currentM -= 60;
    }
  }

  return slots;
}

export async function validateReservation(prisma, restaurantId, data) {
  const errors = [];
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { settings: true },
  });

  if (!restaurant || !restaurant.settings) {
    return ['Restaurant not found or not configured'];
  }

  const settings = restaurant.settings;

  // 1. Party size check
  if (data.partySize > settings.maxPartySize) {
    errors.push(`El tamaño máximo del grupo es ${settings.maxPartySize} personas`);
  }
  if (data.partySize < 1) {
    errors.push('Debe haber al menos 1 persona');
  }

  // 2. Business hours check (Real block)
  const window = await getBusinessWindow(prisma, restaurantId, data.reservationDate);
  if (!window.isOpen) {
    errors.push('El restaurante se encuentra cerrado en esta fecha.');
  } else {
    // Check if within bounds
    const [openH, openM] = window.openTime.split(':').map(Number);
    const [closeH, closeM] = window.closeTime.split(':').map(Number);
    const [resH, resM] = data.reservationTime.split(':').map(Number);
    
    const endH = resH + Math.floor((resM + settings.reservationDurationMinutes) / 60);
    const endM = (resM + settings.reservationDurationMinutes) % 60;

    const resTimeVal = resH * 60 + resM;
    const openTimeVal = openH * 60 + openM;
    const closeTimeVal = closeH * 60 + closeM;
    const endTimeVal = endH * 60 + endM;

    if (resTimeVal < openTimeVal || resTimeVal > closeTimeVal) {
      errors.push(`El horario de atención es de ${window.openTime} a ${window.closeTime}`);
    } else if (endTimeVal > closeTimeVal) {
      errors.push(`La reserva debe terminar antes o a la misma hora del cierre (${window.closeTime})`);
    }
  }

  // 3. Minimum advance hours check using America/Bogota
  const now = new Date(); // Internal UTC
  const reservationDateTime = new Date(`${data.reservationDate}T${data.reservationTime}:00-05:00`);
  const hoursUntil = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil < settings.minAdvanceHours) {
    if (hoursUntil < 0) {
      errors.push('No puedes realizar reservas para horas o fechas que ya han pasado');
    } else {
      errors.push(`Las reservas deben hacerse con al menos ${settings.minAdvanceHours} horas de anticipación`);
    }
  }

  // 4. Capacity check
  if (errors.length === 0) {
    const usedCapacity = await getSlotCapacity(prisma, restaurantId, data.reservationDate, data.reservationTime);
    const remainingCapacity = settings.maxCapacityPerSlot - usedCapacity;

    if (data.partySize > remainingCapacity) {
      errors.push(remainingCapacity <= 0
        ? 'Este horario está lleno'
        : `Solo quedan ${remainingCapacity} lugares disponibles en este horario`
      );
    }
  }

  return errors;
}

/**
 * Capacity calculation utilities
 * Calculates available capacity for time slots based on active reservations
 */

// Get the first restaurant (single-tenant MVP)
export async function getDefaultRestaurant(prisma) {
  return prisma.restaurant.findFirst({
    where: { isActive: true },
    include: { settings: true },
  });
}

// Calculate used capacity for a specific date and time slot
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

// Get all used capacity for a given date grouped by time
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

// Generate available time slots for a given date
export async function getAvailableSlots(prisma, restaurantId, date) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { settings: true },
  });

  if (!restaurant || !restaurant.settings) return [];

  const dayDate = new Date(date + 'T12:00:00');
  const dayOfWeek = dayDate.getDay();
  // Ensure the date is valid
  if (isNaN(dayDate.getTime())) {
    console.error(`[Capacity] Invalid date format received: ${date}`);
    return [];
  }

  const businessHour = await prisma.businessHours.findUnique({
    where: { restaurantId_weekday: { restaurantId, weekday: dayOfWeek } },
  });

  if (!businessHour) {
    console.warn(`[Capacity] No business hours configured for weekday ${dayOfWeek} on date ${date}`);
    return [];
  }

  if (!businessHour.isOpen) {
    console.log(`[Capacity] Date ${date} (Weekday ${dayOfWeek}) is CLOSED.`);
    return [];
  }

  const { maxCapacityPerSlot } = restaurant.settings;
  const dayCapacity = await getDayCapacity(prisma, restaurantId, date);

  // Generate 30-min slots between open and close
  const slots = [];
  const [openH, openM] = businessHour.openTime.split(':').map(Number);
  const [closeH, closeM] = businessHour.closeTime.split(':').map(Number);

  let currentH = openH;
  let currentM = openM;

  while (currentH < closeH || (currentH === closeH && currentM <= closeM)) {
    const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
    const used = dayCapacity[timeStr] || 0;
    const available = maxCapacityPerSlot - used;

    slots.push({
      time: timeStr,
      used,
      available,
      maxCapacity: maxCapacityPerSlot,
      isFull: available <= 0,
    });

    currentM += 30;
    if (currentM >= 60) {
      currentH += 1;
      currentM -= 60;
    }
  }

  return slots;
}

// Validate a reservation against business rules
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

  // 2. Business hours check
  const dayOfWeek = new Date(data.reservationDate + 'T12:00:00').getDay();
  const businessHour = await prisma.businessHours.findUnique({
    where: { restaurantId_weekday: { restaurantId, weekday: dayOfWeek } },
  });

  if (!businessHour || !businessHour.isOpen) {
    errors.push('El restaurante está cerrado ese día');
  } else {
    if (data.reservationTime < businessHour.openTime || data.reservationTime > businessHour.closeTime) {
      errors.push(`El horario de atención es de ${businessHour.openTime} a ${businessHour.closeTime}`);
    }
  }

  // 3. Minimum advance hours check
  const now = new Date();
  const reservationDateTime = new Date(`${data.reservationDate}T${data.reservationTime}:00`);
  const hoursUntil = (reservationDateTime - now) / (1000 * 60 * 60);

  if (hoursUntil < settings.minAdvanceHours) {
    errors.push(`Las reservas deben hacerse con al menos ${settings.minAdvanceHours} horas de anticipación`);
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

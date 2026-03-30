import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.restaurantSettings.deleteMany();
  await prisma.restaurant.deleteMany();

  // ─── Create Restaurant ────────────────────────────────
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'ROSÉ Cafe Bar',
      slug: 'rose-cafe-bar',
      logoUrl: '/Logo.png',
      primaryColor: '#C9A96E',
      secondaryColor: '#1a1a1a',
      timezone: 'America/Bogota',
      phone: '+57 300 123 4567',
      address: 'Calle 85 #15-30, Bogotá, Colombia',
      isActive: true,
    },
  });

  // ─── Create Settings ──────────────────────────────────
  await prisma.restaurantSettings.create({
    data: {
      restaurantId: restaurant.id,
      reservationDurationMinutes: 120,
      maxCapacityPerSlot: 20,
      maxPartySize: 8,
      minAdvanceHours: 2,
      confirmationLeadHours: 8,
      allowSpecialRequests: true,
      defaultOpenTime: '18:00',
      defaultCloseTime: '23:59',
    },
  });

  // ─── Business Hours (Tue-Sun open, Mon closed) ────────
  const days = [
    { weekday: 0, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Sunday
    { weekday: 1, isOpen: false, openTime: '18:00', closeTime: '23:59' }, // Monday (closed)
    { weekday: 2, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Tuesday
    { weekday: 3, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Wednesday
    { weekday: 4, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Thursday
    { weekday: 5, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Friday
    { weekday: 6, isOpen: true, openTime: '18:00', closeTime: '23:59' },  // Saturday
  ];

  for (const day of days) {
    await prisma.businessHours.create({
      data: { restaurantId: restaurant.id, ...day },
    });
  }

  // ─── Create Customers ─────────────────────────────────
  const customerData = [
    { fullName: 'Valentina López', phone: '+573001234567', totalReservations: 5, tags: 'vip,frequent' },
    { fullName: 'Carlos Martínez', phone: '+573009876543', totalReservations: 3, tags: 'returning' },
    { fullName: 'Isabella García', phone: '+573005551234', totalReservations: 4, tags: 'vip' },
    { fullName: 'Andrés Rodríguez', phone: '+573007778899', totalReservations: 1, tags: null },
    { fullName: 'Camila Hernández', phone: '+573006665544', totalReservations: 2, tags: 'returning' },
    { fullName: 'Santiago Díaz', phone: '+573004443322', totalReservations: 3, tags: 'frequent' },
    { fullName: 'Laura Morales', phone: '+573003332211', totalReservations: 1, tags: null },
    { fullName: 'Miguel Torres', phone: '+573002221100', totalReservations: 2, tags: 'returning' },
  ];

  const customers = [];
  for (const c of customerData) {
    const customer = await prisma.customer.create({
      data: {
        restaurantId: restaurant.id,
        fullName: c.fullName,
        phone: c.phone,
        totalReservations: c.totalReservations,
        tags: c.tags,
      },
    });
    customers.push(customer);
  }

  // ─── Generate dates relative to today ─────────────────
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

  // ─── Create Reservations ──────────────────────────────
  const reservations = [
    // Today's reservations
    { customer: 0, date: fmt(today), time: '19:00', party: 4, status: 'confirmed', occasion: 'Cumpleaños', source: 'web' },
    { customer: 1, date: fmt(today), time: '19:30', party: 2, status: 'pending', occasion: null, source: 'whatsapp' },
    { customer: 2, date: fmt(today), time: '20:00', party: 6, status: 'confirmed', occasion: 'Aniversario', source: 'web' },
    { customer: 3, date: fmt(today), time: '20:30', party: 3, status: 'pending', occasion: null, source: 'admin' },
    { customer: 4, date: fmt(today), time: '21:00', party: 2, status: 'confirmed', occasion: 'Plan Romántico', source: 'web' },

    // Tomorrow
    { customer: 5, date: fmt(addDays(today, 1)), time: '19:00', party: 4, status: 'pending', occasion: null, source: 'web' },
    { customer: 6, date: fmt(addDays(today, 1)), time: '20:00', party: 2, status: 'pending', occasion: 'Cumpleaños', source: 'whatsapp' },

    // Past — completed
    { customer: 0, date: fmt(addDays(today, -1)), time: '19:00', party: 3, status: 'completed', occasion: null, source: 'web' },
    { customer: 1, date: fmt(addDays(today, -2)), time: '20:00', party: 2, status: 'completed', occasion: null, source: 'whatsapp' },
    { customer: 2, date: fmt(addDays(today, -3)), time: '21:00', party: 5, status: 'completed', occasion: 'Aniversario', source: 'web' },

    // Past — no-shows
    { customer: 3, date: fmt(addDays(today, -4)), time: '19:30', party: 4, status: 'no_show', occasion: null, source: 'web' },
    { customer: 7, date: fmt(addDays(today, -5)), time: '20:30', party: 2, status: 'no_show', occasion: null, source: 'whatsapp' },

    // Past — cancelled
    { customer: 4, date: fmt(addDays(today, -2)), time: '21:00', party: 3, status: 'cancelled', occasion: null, source: 'web' },
    { customer: 5, date: fmt(addDays(today, -1)), time: '19:30', party: 2, status: 'cancelled', occasion: null, source: 'admin' },

    // Future
    { customer: 0, date: fmt(addDays(today, 3)), time: '20:00', party: 4, status: 'confirmed', occasion: 'Cumpleaños', source: 'web' },
    { customer: 2, date: fmt(addDays(today, 5)), time: '19:00', party: 8, status: 'pending', occasion: null, source: 'whatsapp' },
    { customer: 7, date: fmt(addDays(today, 2)), time: '21:00', party: 2, status: 'pending', occasion: null, source: 'web' },

    // Extra this month for metrics
    { customer: 6, date: fmt(addDays(today, -7)), time: '20:00', party: 3, status: 'completed', occasion: null, source: 'web' },
    { customer: 5, date: fmt(addDays(today, -10)), time: '19:00', party: 5, status: 'completed', occasion: null, source: 'whatsapp' },
    { customer: 1, date: fmt(addDays(today, -8)), time: '21:00', party: 2, status: 'completed', occasion: null, source: 'web' },
  ];

  for (const r of reservations) {
    const c = customers[r.customer];
    const statusDates = {};
    if (r.status === 'confirmed') statusDates.confirmedAt = new Date();
    if (r.status === 'cancelled') statusDates.cancelledAt = new Date();
    if (r.status === 'completed') statusDates.completedAt = new Date();
    if (r.status === 'no_show') statusDates.noShowAt = new Date();

    await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        customerId: c.id,
        fullName: c.fullName,
        phone: c.phone,
        reservationDate: r.date,
        reservationTime: r.time,
        partySize: r.party,
        status: r.status,
        source: r.source,
        occasion: r.occasion,
        createdByRole: r.source === 'admin' ? 'admin' : 'customer',
        ...statusDates,
      },
    });
  }

  // Update customer last reservation dates
  for (let i = 0; i < customers.length; i++) {
    const lastRes = await prisma.reservation.findFirst({
      where: { customerId: customers[i].id },
      orderBy: { reservationDate: 'desc' },
    });
    if (lastRes) {
      await prisma.customer.update({
        where: { id: customers[i].id },
        data: {
          lastReservationAt: new Date(lastRes.reservationDate),
          lastStatus: lastRes.status,
        },
      });
    }
  }

  console.log('✅ Seed complete!');
  console.log(`   Restaurant: ${restaurant.name} (${restaurant.id})`);
  console.log(`   Customers: ${customers.length}`);
  console.log(`   Reservations: ${reservations.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

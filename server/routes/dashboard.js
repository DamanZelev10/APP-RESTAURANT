import { Router } from 'express';
import { getDefaultRestaurant } from '../utils/capacity.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. KPI: Reservations this month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const reservationsThisMonth = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: firstDayOfMonth },
        status: { not: 'cancelled' }
      }
    });

    // 2. KPI: Reservations this quarter
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    const firstDayOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1).toISOString().split('T')[0];
    const reservationsThisQuarter = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: firstDayOfQuarter },
        status: { not: 'cancelled' }
      }
    });

    // 3. KPI: Today's reservations
    const todayCount = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: todayStr,
        status: { not: 'cancelled' }
      }
    });

    // 4. KPI: Upcoming reservations (next 48h)
    const upcomingCount = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: todayStr },
        status: 'pending'
      }
    });

    // 5. Unique customers this month
    const uniqueCustomersMonth = await req.prisma.reservation.groupBy({
      by: ['phone'],
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: firstDayOfMonth }
      }
    });

    // 6. No-show rate
    const totalPast = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { lt: todayStr },
        status: { in: ['completed', 'no_show'] }
      }
    });
    const noShows = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { lt: todayStr },
        status: 'no_show'
      }
    });
    const noShowRate = totalPast > 0 ? (noShows / totalPast) * 100 : 0;

    // 7. Confirmation rate
    const activeTodayFuture = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: todayStr },
        status: { in: ['pending', 'confirmed'] }
      }
    });
    const confirmedCount = await req.prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: todayStr },
        status: 'confirmed'
      }
    });
    const confirmationRate = activeTodayFuture > 0 ? (confirmedCount / activeTodayFuture) * 100 : 0;

    // 8. Peak Hours (grouped by time)
    const peakHoursRaw = await req.prisma.reservation.groupBy({
      by: ['reservationTime'],
      where: {
        restaurantId: restaurant.id,
        status: { not: 'cancelled' }
      },
      _count: { id: true },
      orderBy: { reservationTime: 'asc' }
    });

    // 9. Reservations by day (this month)
    const reservationsByDay = await req.prisma.reservation.groupBy({
      by: ['reservationDate'],
      where: {
        restaurantId: restaurant.id,
        reservationDate: { gte: firstDayOfMonth },
        status: { not: 'cancelled' }
      },
      _count: { id: true },
      orderBy: { reservationDate: 'asc' }
    });

    // 10. Status distribution
    const statusDist = await req.prisma.reservation.groupBy({
      by: ['status'],
      where: { restaurantId: restaurant.id },
      _count: { id: true }
    });

    // 11. Returning vs New
    const totalCustomers = await req.prisma.customer.count({ where: { restaurantId: restaurant.id } });
    const returningCustomers = await req.prisma.customer.count({
      where: {
        restaurantId: restaurant.id,
        totalReservations: { gt: 1 }
      }
    });

    res.json({
      kpis: {
        reservationsMonth: reservationsThisMonth,
        reservationsQuarter: reservationsThisQuarter,
        todayCount,
        upcomingCount,
        uniqueCustomersMonth: uniqueCustomersMonth.length,
        noShowRate: Math.round(noShowRate),
        confirmationRate: Math.round(confirmationRate)
      },
      charts: {
        peakHours: peakHoursRaw.map(item => ({ time: item.reservationTime, count: item._count.id })),
        dailyReservations: reservationsByDay.map(item => ({ date: item.reservationDate, count: item._count.id })),
        statusDistribution: statusDist.map(item => ({ status: item.status, count: item._count.id })),
        customerMix: [
          { name: 'New', value: totalCustomers - returningCustomers },
          { name: 'Returning', value: returningCustomers }
        ]
      },
      insights: [
        `Peak hour today tends to be around 8:00 PM based on history.`,
        `${upcomingCount} reservations are still pending confirmation.`,
        `No-show rate this month is ${Math.round(noShowRate)}%.`,
        `Confirmation rate is ${Math.round(confirmationRate)}%.`
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import { Router } from 'express';
import { getDefaultRestaurant, getSlotCapacity } from '../utils/capacity.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const hourTwoStr = twoHoursFromNow.getHours().toString().padStart(2, '0') + ":" + twoHoursFromNow.getMinutes().toString().padStart(2, '0');

    const alerts = [];

    // 1. Upcoming reservations in next 2 hours for today
    const upcoming = await req.prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        reservationDate: todayStr,
        reservationTime: { gte: now.toTimeString().split(' ')[0].substring(0, 5), lte: hourTwoStr },
        status: { in: ['pending', 'confirmed'] }
      },
      orderBy: { reservationTime: 'asc' }
    });
    
    upcoming.forEach(res => {
      alerts.push({
        id: `upcoming-${res.id}`,
        type: 'info',
        title: 'Próxima Reserva',
        message: `${res.fullName} llega a las ${res.reservationTime} (${res.partySize} personas)`,
        reservationId: res.id,
        action: 'view'
      });
    });

    // 2. Reservations pending confirmation for today
    const pendingToday = await req.prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        reservationDate: todayStr,
        status: 'pending'
      }
    });

    if (pendingToday.length > 0) {
      alerts.push({
        id: 'pending-today',
        type: 'warning',
        title: 'Pendientes de Confirmar',
        message: `Tienes ${pendingToday.length} reservas para hoy que aún no han sido confirmadas.`,
        action: 'filter-pending',
        severity: 'high'
      });
    }

    // 3. Returning VIP-like customers (3+ reservations) among today's arrivals
    const frequentToday = await req.prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        reservationDate: todayStr,
        status: { in: ['pending', 'confirmed'] },
        customer: {
          totalReservations: { gte: 3 }
        }
      },
      include: { customer: true }
    });

    frequentToday.forEach(res => {
      alerts.push({
        id: `vip-${res.id}`,
        type: 'info',
        title: 'Cliente Frecuente',
        message: `${res.fullName} nos visita hoy. Tiene ${res.customer.totalReservations} reservas previas.`,
        reservationId: res.id,
        action: 'view'
      });
    });

    // 4. Overbooked check (very simple: any slot > max capacity)
    // For MVP, we'll just check if any slot for today is over 90% full
    const { maxCapacityPerSlot } = restaurant.settings;
    const capacityToday = await req.prisma.reservation.groupBy({
      by: ['reservationTime'],
      where: {
        restaurantId: restaurant.id,
        reservationDate: todayStr,
        status: { in: ['pending', 'confirmed'] }
      },
      _sum: { partySize: true }
    });

    capacityToday.forEach(slot => {
      const sum = slot._sum.partySize || 0;
      if (sum >= maxCapacityPerSlot * 0.9) {
        alerts.push({
          id: `overbook-${slot.reservationTime}`,
          type: 'critical',
          title: 'Slot casi lleno',
          message: `El horario de las ${slot.reservationTime} tiene ${sum}/${maxCapacityPerSlot} personas reservadas.`,
          action: 'view-time',
          meta: { time: slot.reservationTime }
        });
      }
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

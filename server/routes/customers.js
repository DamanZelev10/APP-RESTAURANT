import { Router } from 'express';
import { getDefaultRestaurant } from '../utils/capacity.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { name, phone } = req.query;
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const where = { restaurantId: restaurant.id };
    if (name) where.fullName = { contains: name };
    if (phone) where.phone = { contains: phone };

    const customers = await req.prisma.customer.findMany({
      where,
      orderBy: { totalReservations: 'desc' }
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const customer = await req.prisma.customer.findFirst({
      where: { id: req.params.id, restaurantId: restaurant.id },
      include: { 
        reservations: {
          orderBy: { reservationDate: 'desc' }
        }
      }
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.customer.findFirst({
      where: { id: req.params.id, restaurantId: restaurant.id }
    });
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    const { isActive } = req.body;
    const customer = await req.prisma.customer.update({
      where: { id: existing.id },
      data: { isActive }
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.customer.findFirst({
      where: { id: req.params.id, restaurantId: restaurant.id }
    });
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    // Delete associated reservations first
    await req.prisma.reservation.deleteMany({
      where: { customerId: existing.id }
    });
    const deleted = await req.prisma.customer.delete({
      where: { id: existing.id }
    });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

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
    const customer = await req.prisma.customer.findUnique({
      where: { id: req.params.id },
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

export default router;

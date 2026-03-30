import { Router } from 'express';
import { getDefaultRestaurant } from '../utils/capacity.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const { name, phone, address, logoUrl, timezone } = req.body;
    const updated = await req.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { name, phone, address, logoUrl, timezone }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });
    res.json(restaurant.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const { 
      reservationDurationMinutes, 
      maxCapacityPerSlot, 
      maxPartySize, 
      minAdvanceHours, 
      confirmationLeadHours, 
      allowSpecialRequests, 
      defaultOpenTime, 
      defaultCloseTime 
    } = req.body;

    const updated = await req.prisma.restaurantSettings.update({
      where: { restaurantId: restaurant.id },
      data: {
        reservationDurationMinutes: parseInt(reservationDurationMinutes),
        maxCapacityPerSlot: parseInt(maxCapacityPerSlot),
        maxPartySize: parseInt(maxPartySize),
        minAdvanceHours: parseInt(minAdvanceHours),
        confirmationLeadHours: parseInt(confirmationLeadHours),
        allowSpecialRequests,
        defaultOpenTime,
        defaultCloseTime
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/business-hours', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const hours = await req.prisma.businessHours.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { weekday: 'asc' }
    });
    res.json(hours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/business-hours/:id', async (req, res) => {
  try {
    const { isOpen, openTime, closeTime } = req.body;
    const updated = await req.prisma.businessHours.update({
      where: { id: req.params.id },
      data: { isOpen, openTime, closeTime }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

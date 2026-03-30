import { Router } from 'express';
import { validateReservation, getAvailableSlots, getDefaultRestaurant, getDayCapacity } from '../utils/capacity.js';
import { getWhatsAppAction } from '../utils/whatsapp.js';

const router = Router();

// GET /api/reservations — list with filters
router.get('/', async (req, res) => {
  try {
    const { date, status, phone, name, occasion, source } = req.query;
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const where = { restaurantId: restaurant.id };
    if (date) where.reservationDate = date;
    if (status) where.status = status;
    if (source) where.source = source;
    if (occasion) where.occasion = { contains: occasion };
    if (phone) where.phone = { contains: phone };
    if (name) where.fullName = { contains: name };

    const reservations = await req.prisma.reservation.findMany({
      where,
      orderBy: [{ reservationDate: 'desc' }, { reservationTime: 'asc' }],
      include: { customer: true },
    });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/slots?date=YYYY-MM-DD — available time slots
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const slots = await getAvailableSlots(req.prisma, restaurant.id, date);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/capacity?date=YYYY-MM-DD — day capacity overview
router.get('/capacity', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const capacity = await getDayCapacity(req.prisma, restaurant.id, date);
    res.json({
      date,
      maxCapacityPerSlot: restaurant.settings.maxCapacityPerSlot,
      slots: capacity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/:id
router.get('/:id', async (req, res) => {
  try {
    const reservation = await req.prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { customer: true, notificationLogs: true },
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations — create
router.post('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const data = req.body;
    const errors = await validateReservation(req.prisma, restaurant.id, data);
    if (errors.length > 0) return res.status(400).json({ errors });

    // Find or create customer by phone
    let customer = await req.prisma.customer.findUnique({
      where: { restaurantId_phone: { restaurantId: restaurant.id, phone: data.phone } },
    });

    if (customer) {
      customer = await req.prisma.customer.update({
        where: { id: customer.id },
        data: {
          fullName: data.fullName,
          totalReservations: { increment: 1 },
          lastReservationAt: new Date(),
          lastStatus: 'pending',
        },
      });
    } else {
      customer = await req.prisma.customer.create({
        data: {
          restaurantId: restaurant.id,
          fullName: data.fullName,
          phone: data.phone,
          totalReservations: 1,
          lastReservationAt: new Date(),
          lastStatus: 'pending',
        },
      });
    }

    const reservation = await req.prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        customerId: customer.id,
        fullName: data.fullName,
        phone: data.phone,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        partySize: parseInt(data.partySize),
        occasion: data.occasion || null,
        specialRequests: data.specialRequests || null,
        status: 'pending',
        source: data.source || 'web',
        createdByRole: data.createdByRole || 'customer',
        notesInternal: data.notesInternal || null,
      },
    });

    // Audit log
    await req.prisma.auditLog.create({
      data: {
        restaurantId: restaurant.id,
        entityType: 'reservation',
        entityId: reservation.id,
        action: 'create',
        actorRole: data.createdByRole || 'customer',
        actorName: data.fullName,
        metadataJson: JSON.stringify({ status: 'pending', source: data.source || 'web' }),
      },
    });

    // Create pending notification log for confirmation
    const settings = restaurant.settings;
    if (settings) {
      const reservationDateTime = new Date(`${data.reservationDate}T${data.reservationTime}:00`);
      const reminderTime = new Date(reservationDateTime.getTime() - settings.confirmationLeadHours * 60 * 60 * 1000);

      await req.prisma.notificationLog.create({
        data: {
          restaurantId: restaurant.id,
          reservationId: reservation.id,
          type: 'confirmation_request',
          channel: 'whatsapp',
          status: 'pending',
          scheduledFor: reminderTime,
          payloadJson: JSON.stringify(getWhatsAppAction('confirmation_request', reservation)),
        },
      });
    }

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reservations/:id — update
router.put('/:id', async (req, res) => {
  try {
    const existing = await req.prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    const data = req.body;
    const updateData = {};

    if (data.fullName) updateData.fullName = data.fullName;
    if (data.phone) updateData.phone = data.phone;
    if (data.reservationDate) updateData.reservationDate = data.reservationDate;
    if (data.reservationTime) updateData.reservationTime = data.reservationTime;
    if (data.partySize) updateData.partySize = parseInt(data.partySize);
    if (data.occasion !== undefined) updateData.occasion = data.occasion;
    if (data.specialRequests !== undefined) updateData.specialRequests = data.specialRequests;
    if (data.source) updateData.source = data.source;
    if (data.notesInternal !== undefined) updateData.notesInternal = data.notesInternal;

    const reservation = await req.prisma.reservation.update({
      where: { id: req.params.id },
      data: updateData,
    });

    await req.prisma.auditLog.create({
      data: {
        restaurantId: existing.restaurantId,
        entityType: 'reservation',
        entityId: reservation.id,
        action: 'update',
        actorRole: 'admin',
        metadataJson: JSON.stringify(updateData),
      },
    });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reservations/:id/status — change status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'no_show', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = await req.prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    const statusDates = {};
    if (status === 'confirmed') statusDates.confirmedAt = new Date();
    if (status === 'cancelled') statusDates.cancelledAt = new Date();
    if (status === 'completed') statusDates.completedAt = new Date();
    if (status === 'no_show') statusDates.noShowAt = new Date();

    const reservation = await req.prisma.reservation.update({
      where: { id: req.params.id },
      data: { status, ...statusDates },
    });

    // Update customer last status
    if (existing.customerId) {
      await req.prisma.customer.update({
        where: { id: existing.customerId },
        data: { lastStatus: status },
      });
    }

    await req.prisma.auditLog.create({
      data: {
        restaurantId: existing.restaurantId,
        entityType: 'reservation',
        entityId: reservation.id,
        action: 'status_change',
        actorRole: 'admin',
        metadataJson: JSON.stringify({ from: existing.status, to: status }),
      },
    });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reservations/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await req.prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    // Delete related logs first
    await req.prisma.notificationLog.deleteMany({ where: { reservationId: req.params.id } });
    await req.prisma.reservation.delete({ where: { id: req.params.id } });

    await req.prisma.auditLog.create({
      data: {
        restaurantId: existing.restaurantId,
        entityType: 'reservation',
        entityId: existing.id,
        action: 'delete',
        actorRole: 'admin',
        actorName: null,
        metadataJson: JSON.stringify({ fullName: existing.fullName, date: existing.reservationDate }),
      },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations/:id/whatsapp — generate whatsapp deep link
router.post('/:id/whatsapp', async (req, res) => {
  try {
    const { type } = req.body; // reminder, confirmation_request, cancellation
    const reservation = await req.prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    const action = getWhatsAppAction(type || 'reminder', reservation);
    if (!action) return res.status(400).json({ error: 'Invalid message type' });

    // Log the notification
    await req.prisma.notificationLog.create({
      data: {
        restaurantId: reservation.restaurantId,
        reservationId: reservation.id,
        type: type || 'reminder',
        channel: 'whatsapp',
        status: 'sent',
        scheduledFor: new Date(),
        sentAt: new Date(),
        payloadJson: JSON.stringify(action),
      },
    });

    if (type === 'confirmation_request') {
      await req.prisma.reservation.update({
        where: { id: req.params.id },
        data: { confirmationSentAt: new Date() },
      });
    }

    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

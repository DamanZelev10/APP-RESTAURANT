import { Router } from 'express';
import { validateReservation, getAvailableSlots, getDefaultRestaurant, getDayCapacity } from '../utils/capacity.js';
import { getWhatsAppAction } from '../utils/whatsapp.js';
import { normalizePhone } from '../utils/phone.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/reservations — list with filters (ADMIN ONLY)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, startDate, endDate, status, phone, name, occasion, source } = req.query;
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const where = { restaurantId: restaurant.id };
    
    if (date) {
      where.reservationDate = date;
    } else if (startDate || endDate) {
      where.reservationDate = {};
      if (startDate) where.reservationDate.gte = startDate;
      if (endDate) where.reservationDate.lte = endDate;
    }

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

// GET /api/reservations/slots?date=YYYY-MM-DD — available time slots (PUBLIC)
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

// GET /api/reservations/capacity?date=YYYY-MM-DD — day capacity overview (PUBLIC)
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

// GET /api/reservations/customer-search — Search reservations for a customer (PUBLIC/PORTAL)
// TODO (Security): Proteger este endpoint en el próximo parche para evitar enumeración.
router.get('/customer-search', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    const normalizedPhone = normalizePhone(phone);
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const reservations = await req.prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        phone: normalizedPhone,
        status: { in: ['pending', 'confirmed', 'completed'] }
      },
      orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }],
    });

    const now = new Date();
    const filtered = reservations.filter(res => {
      if (res.status === 'completed') {
        const resDateTime = new Date(`${res.reservationDate}T${res.reservationTime}:00-05:00`);
        const expiryTime = new Date(resDateTime.getTime() + 60 * 60 * 1000);
        return expiryTime > now;
      }
      return true;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/:id (ADMIN ONLY)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const reservation = await req.prisma.reservation.findFirst({
      where: { id: req.params.id, restaurantId: restaurant.id },
      include: { customer: true, notificationLogs: true },
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations — create (PUBLIC)
router.post('/', async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    if (!restaurant) return res.status(404).json({ error: 'No restaurant found' });

    const data = req.body;
    const errors = await validateReservation(req.prisma, restaurant.id, data);
    if (errors.length > 0) return res.status(400).json({ errors });

    const normalizedPhone = normalizePhone(data.phone);

    // Transaction
    const reservation = await req.prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({
        where: { restaurantId_phone: { restaurantId: restaurant.id, phone: normalizedPhone } },
      });

      if (customer) {
        if (!customer.isActive) {
          throw new Error('Tu cuenta ha sido restringida administrativamente. Por favor, contacta a soporte.');
        }
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            fullName: data.fullName,
            idNumber: data.idNumber || customer.idNumber,
            totalReservations: { increment: 1 },
            lastReservationAt: new Date(),
            lastStatus: 'pending',
          },
        });
      } else {
        customer = await tx.customer.create({
          data: {
            restaurantId: restaurant.id,
            fullName: data.fullName,
            phone: normalizedPhone,
            idNumber: data.idNumber || null,
            totalReservations: 1,
            lastReservationAt: new Date(),
            lastStatus: 'pending',
          },
        });
      }

      const resv = await tx.reservation.create({
        data: {
          restaurantId: restaurant.id,
          customerId: customer.id,
          fullName: data.fullName,
          phone: normalizedPhone,
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

      await tx.auditLog.create({
        data: {
          restaurantId: restaurant.id,
          entityType: 'reservation',
          entityId: resv.id,
          action: 'create',
          actorRole: data.createdByRole || 'customer',
          actorName: data.fullName,
          metadataJson: JSON.stringify({ status: 'pending', source: data.source || 'web' }),
        },
      });

      const settings = restaurant.settings;
      if (settings) {
        const reservationDateTime = new Date(`${data.reservationDate}T${data.reservationTime}:00-05:00`);
        const reminderTime = new Date(reservationDateTime.getTime() - settings.confirmationLeadHours * 60 * 60 * 1000);

        await tx.notificationLog.create({
          data: {
            restaurantId: restaurant.id,
            reservationId: resv.id,
            type: 'confirmation_request',
            channel: 'whatsapp',
            status: 'pending',
            scheduledFor: reminderTime,
            payloadJson: JSON.stringify(getWhatsAppAction('confirmation_request', resv)),
          },
        });
      }

      return resv;
    });

    res.status(201).json(reservation);
  } catch (err) {
    if (err.message.includes('cuenta ha sido restringida')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reservations/:id — update (ADMIN ONLY)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.reservation.findFirst({ 
      where: { id: req.params.id, restaurantId: restaurant.id } 
    });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    const data = req.body;
    const updateData = {};

    if (data.fullName) updateData.fullName = data.fullName;
    if (data.phone) updateData.phone = normalizePhone(data.phone);
    if (data.reservationDate) updateData.reservationDate = data.reservationDate;
    if (data.reservationTime) updateData.reservationTime = data.reservationTime;
    if (data.partySize) updateData.partySize = parseInt(data.partySize);
    if (data.occasion !== undefined) updateData.occasion = data.occasion;
    if (data.specialRequests !== undefined) updateData.specialRequests = data.specialRequests;
    if (data.source) updateData.source = data.source;
    if (data.notesInternal !== undefined) updateData.notesInternal = data.notesInternal;

    const reservation = await req.prisma.reservation.update({
      where: { id: existing.id },
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

// PATCH /api/reservations/:id/status — change status (ADMIN ONLY)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'no_show', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.reservation.findFirst({ 
      where: { id: req.params.id, restaurantId: restaurant.id } 
    });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    const statusDates = {};
    if (status === 'confirmed') {
      statusDates.confirmedAt = new Date();
      // REMOVED isPaid = true and paidAt = new Date() logic here
    } else if (status === 'cancelled') {
      statusDates.cancelledAt = new Date();
    } else if (status === 'completed') {
      statusDates.completedAt = new Date();
    } else if (status === 'no_show') {
      statusDates.noShowAt = new Date();
    } else if (status === 'pending') {
      statusDates.confirmedAt = null;
      statusDates.cancelledAt = null;
      statusDates.completedAt = null;
      statusDates.noShowAt = null;
    }

    const reservation = await req.prisma.reservation.update({
      where: { id: existing.id },
      data: { status, ...statusDates },
    });

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

// PATCH /api/reservations/:id/customer-action — Customer confirm/cancel (PUBLIC/PORTAL)
// TODO (Security): Proteger este endpoint en el próximo parche para evitar abuso.
router.patch('/:id/customer-action', async (req, res) => {
  try {
    const { action } = req.body; 
    const allowedActions = ['confirm', 'cancel'];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be confirm or cancel.' });
    }

    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.reservation.findFirst({ 
      where: { id: req.params.id, restaurantId: restaurant.id } 
    });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });
    
    if (action === 'confirm' && existing.status !== 'pending') {
      return res.status(400).json({ error: 'Reservation is already ' + existing.status });
    }

    const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';
    const statusDates = {};
    if (newStatus === 'confirmed') statusDates.confirmedAt = new Date();
    if (newStatus === 'cancelled') statusDates.cancelledAt = new Date();

    const reservation = await req.prisma.reservation.update({
      where: { id: existing.id },
      data: { status: newStatus, ...statusDates },
    });

    await req.prisma.auditLog.create({
      data: {
        restaurantId: existing.restaurantId,
        entityType: 'reservation',
        entityId: reservation.id,
        action: 'customer_' + action,
        actorRole: 'customer',
        actorName: existing.fullName,
        metadataJson: JSON.stringify({ from: existing.status, to: newStatus }),
      },
    });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reservations/:id (ADMIN ONLY)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const restaurant = await getDefaultRestaurant(req.prisma);
    const existing = await req.prisma.reservation.findFirst({ 
      where: { id: req.params.id, restaurantId: restaurant.id } 
    });
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    await req.prisma.$transaction(async (tx) => {
      await tx.notificationLog.deleteMany({ where: { reservationId: existing.id } });
      await tx.payment.deleteMany({ where: { reservationId: existing.id } });
      await tx.reservation.delete({ where: { id: existing.id } });

      await tx.auditLog.create({
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
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations/:id/whatsapp — generate whatsapp deep link (ADMIN ONLY)
router.post('/:id/whatsapp', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body; 
    const restaurant = await getDefaultRestaurant(req.prisma);
    const reservation = await req.prisma.reservation.findFirst({ 
      where: { id: req.params.id, restaurantId: restaurant.id } 
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    const action = getWhatsAppAction(type || 'reminder', reservation);
    if (!action) return res.status(400).json({ error: 'Invalid message type' });

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

    const updateData = {
      lastWhatsappAction: new Date(),
      lastWhatsappMessageType: type || 'reminder',
    };

    if (type === 'confirmation_request') {
      updateData.confirmationSentAt = new Date();
    }

    await req.prisma.reservation.update({
      where: { id: reservation.id },
      data: updateData,
    });

    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

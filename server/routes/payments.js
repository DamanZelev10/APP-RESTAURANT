// server/routes/payments.js
import express from 'express';
import { PaymentService } from '../services/paymentService.js';

const router = express.Router();

// Define router closure for prisma
export const registerPaymentRoutes = (prisma) => {
  const paymentService = new PaymentService(prisma);

  // POST /api/payments/create-checkout
  router.post('/create-checkout', async (req, res) => {
    try {
      const { reservationId } = req.body;
      if (!reservationId) return res.status(400).json({ error: 'Missing reservationId' });

      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId }
      });

      if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

      const checkout = await paymentService.createCheckout(reservation);
      res.json(checkout);
    } catch (err) {
      console.error('[Payment] Create Checkout Error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/payments/webhook/:provider
  router.post('/webhook/:provider', async (req, res) => {
    try {
      const { provider } = req.params;
      const payload = req.body;
      
      console.log(`[Payment] Webhook received from ${provider}:`, payload);
      
      const result = await paymentService.handleWebhook(provider, payload);
      
      if (result.handled) {
        res.json({ message: 'Webhook processed', status: result.status });
      } else {
        res.status(400).json({ error: 'Provider not supported or payload invalid' });
      }
    } catch (err) {
      console.error('[Payment] Webhook Error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/payments/status/:reservationId
  router.get('/status/:reservationId', async (req, res) => {
    try {
      const { reservationId } = req.params;
      
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: { status: true, isPaid: true }
      });

      if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

      // Fetch latest payment for more detail (optional)
      const latestPayment = await prisma.payment.findFirst({
        where: { reservationId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        reservationStatus: reservation.status,
        isPaid: reservation.isPaid,
        paymentStatus: latestPayment?.status || 'none'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export default router;

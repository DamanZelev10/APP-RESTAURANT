// server/services/paymentService.js
import { MockProvider } from './mockProvider.js';

export class PaymentService {
  constructor(prisma) {
    this.prisma = prisma;
    // Current active provider (can be changed via settings later)
    this.provider = new MockProvider(prisma);
  }

  async createCheckout(reservation) {
    // 1. Check if reservation exists and is unpaid
    if (reservation.isPaid) {
      throw new Error('Reservation is already paid');
    }

    // 2. Call provider to generate checkout URL
    const checkout = await this.provider.createCheckout(reservation);

    // 3. Save pending payment record in DB
    const payment = await this.prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: 20000,
        currency: 'COP',
        status: 'pending',
        provider: 'mock',
        providerPaymentId: checkout.providerPaymentId,
        paymentUrl: checkout.url
      }
    });

    return {
      paymentId: payment.id,
      url: checkout.url
    };
  }

  async handleWebhook(providerName, payload) {
    // Dispatch to correct provider logic
    if (providerName === 'mock') {
      const result = await this.provider.processWebhook(payload);
      
      if (result.status === 'success') {
        await this.finalizePayment(result.providerPaymentId, payload);
        return { handled: true, status: 'success' };
      }
    }
    
    // Add other providers here (wompi, mercadopago)
    return { handled: false };
  }

  async finalizePayment(providerPaymentId, rawPayload) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerPaymentId, status: 'pending' }
    });

    if (!payment) return;

    // Update payment record
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'success',
        paidAt: new Date(),
        rawWebhook: JSON.stringify(rawPayload)
      }
    });

    // CRITICAL: Update Reservation status and isPaid
    await this.prisma.reservation.update({
      where: { id: payment.reservationId },
      data: {
        status: 'confirmed',
        isPaid: true,
        paidAt: new Date(),
        confirmedAt: new Date()
      }
    });
    
    // Add to audit log
    const res = await this.prisma.reservation.findUnique({ where: { id: payment.reservationId } });
    if (res) {
      await this.prisma.auditLog.create({
        data: {
          restaurantId: res.restaurantId,
          entityType: 'reservation',
          entityId: payment.reservationId,
          action: 'status_change',
          actorRole: 'system',
          actorName: 'Payment Gateway',
          metadataJson: JSON.stringify({ action: 'payment_success', provider: payment.provider })
        }
      });
    }
  }
}

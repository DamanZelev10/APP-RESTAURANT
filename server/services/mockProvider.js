// server/services/mockProvider.js
import { v4 as uuidv4 } from 'uuid';

export class MockProvider {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Generates a fake checkout URL and providerPaymentId
   */
  async createCheckout(reservation) {
    const providerPaymentId = `MOCK_${uuidv4().split('-')[0].toUpperCase()}`;
    // Simulate a redirect URL to a "payment successful" simulation page on the frontend
    // In a real provider, this would be their checkout page.
    const url = `/payment-sandbox?reservationId=${reservation.id}&providerPaymentId=${providerPaymentId}`;
    
    return {
      url,
      providerPaymentId
    };
  }

  /**
   * Processes the mock webhook payload
   */
  async processWebhook(payload) {
    // In a real provider, we would validate signatures here.
    // For mock, we just check for the presence of status: 'success'
    if (payload.status === 'success' && payload.providerPaymentId) {
      return {
        status: 'success',
        providerPaymentId: payload.providerPaymentId
      };
    }
    
    return { status: 'failed' };
  }
}

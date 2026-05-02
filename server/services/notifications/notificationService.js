import { sendWhatsAppText as sendMock } from './providers/mockProvider.js';
import { sendWhatsAppText as sendCloud } from './providers/whatsappCloudProvider.js';
import { buildReservationAccessMessage } from './templates/reservationMessages.js';

export async function sendReservationAccessLinks({
  prisma,
  restaurantId,
  reservationsWithLinks,
  requestedPhone
}) {
  const isEnabled = process.env.WHATSAPP_SEND_ENABLED === 'true';
  const providerType = process.env.WHATSAPP_PROVIDER || 'mock';
  const mode = process.env.WHATSAPP_SEND_MODE || 'test';
  const testRecipient = process.env.WHATSAPP_DEV_RECIPIENT_PHONE;

  for (const item of reservationsWithLinks) {
    const { reservation, portalUrl, expiresAt } = item;

    // Determine recipient
    let recipientPhone = reservation.phone;
    if (mode === 'test') {
      if (!testRecipient) {
        console.warn('[Notification Service] test mode active but WHATSAPP_DEV_RECIPIENT_PHONE not set');
        continue;
      }
      recipientPhone = testRecipient;
    }

    // Clean phone number for WhatsApp (remove + and spaces)
    const cleanPhone = recipientPhone.replace(/\D/g, '');

    // Build message
    const messageBody = buildReservationAccessMessage({
      customerName: reservation.fullName,
      portalUrl
    });

    // Create NotificationLog pending
    let logId = null;
    try {
      const sanitizedPayload = {
        portalUrl: portalUrl.replace(/token=[A-Za-z0-9_-]+/g, 'token=[REDACTED]'),
        expiresAt
      };

      const log = await prisma.notificationLog.create({
        data: {
          restaurantId,
          reservationId: reservation.id,
          type: 'access_request',
          channel: 'whatsapp',
          status: 'pending',
          scheduledFor: new Date(),
          payloadJson: JSON.stringify(sanitizedPayload)
        }
      });
      logId = log.id;
    } catch (err) {
      console.error('[Notification Service] failed to create pending log', err);
    }

    if (!isEnabled) {
      if (logId) {
        await prisma.notificationLog.update({
          where: { id: logId },
          data: { status: 'skipped', payloadJson: JSON.stringify({ reason: 'WHATSAPP_SEND_ENABLED is false' }) }
        });
      }
      continue;
    }

    // Send via provider
    const sendFn = providerType === 'cloud_api' ? sendCloud : sendMock;
    
    try {
      const result = await sendFn({
        to: cleanPhone,
        body: messageBody,
        previewUrl: true
      });

      if (logId) {
        if (result.success) {
          await prisma.notificationLog.update({
            where: { id: logId },
            data: { 
              status: 'sent',
              sentAt: new Date(),
              payloadJson: JSON.stringify({
                provider: result.provider,
                providerMessageId: result.providerMessageId
              })
            }
          });
        } else {
          await prisma.notificationLog.update({
            where: { id: logId },
            data: { 
              status: 'failed',
              payloadJson: JSON.stringify({
                provider: result.provider,
                errorCode: result.errorCode,
                errorMessage: result.errorMessage
              })
            }
          });
        }
      }
    } catch (err) {
      if (logId) {
        await prisma.notificationLog.update({
          where: { id: logId },
          data: { 
            status: 'failed',
            payloadJson: JSON.stringify({ errorMessage: err.message })
          }
        });
      }
    }
  }
}

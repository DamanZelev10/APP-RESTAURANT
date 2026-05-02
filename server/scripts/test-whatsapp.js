import dotenv from 'dotenv';
dotenv.config();

import { sendWhatsAppText as sendCloud } from '../services/notifications/providers/whatsappCloudProvider.js';
import { sendWhatsAppText as sendMock } from '../services/notifications/providers/mockProvider.js';

async function test() {
  const providerType = process.env.WHATSAPP_PROVIDER || 'mock';
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const devPhone = process.env.WHATSAPP_DEV_RECIPIENT_PHONE;

  if (providerType === 'cloud_api' && (!phoneId || !token || !devPhone)) {
    console.error('ERROR: Faltan variables WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_DEV_RECIPIENT_PHONE en el .env');
    process.exit(1);
  }

  if (!devPhone) {
    console.error('ERROR: Falta WHATSAPP_DEV_RECIPIENT_PHONE en el .env');
    process.exit(1);
  }

  console.log(`Provider: ${providerType}`);
  console.log(`Recipient: ${devPhone.replace(/.(?=.{4})/g, '*')}`);

  const messageBody = 'Hola 👋 Este es un mensaje de prueba desde el backend local de ROSÉ Gastro Bar usando WhatsApp Cloud API.';

  const sendFn = providerType === 'cloud_api' ? sendCloud : sendMock;

  try {
    const result = await sendFn({
      to: devPhone,
      body: messageBody,
      previewUrl: false
    });

    if (result.success) {
      console.log('Result: success');
      console.log(`ProviderMessageId: ${result.providerMessageId}`);
    } else {
      console.log('Result: failure');
      console.log(`Error: ${result.errorMessage}`);
    }
  } catch (err) {
    console.error('Error no controlado:', err);
  }
}

test();

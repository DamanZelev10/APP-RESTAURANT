/**
 * WhatsApp Cloud API Provider
 */
export async function sendWhatsAppText({ to, body, previewUrl = true }) {
  const version = process.env.WHATSAPP_API_VERSION || 'v25.0';
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    return {
      success: false,
      provider: 'cloud_api',
      errorMessage: 'Faltan credenciales WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN'
    };
  }

  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: previewUrl,
      body
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp Cloud Error]:', JSON.stringify(data?.error?.message || data, null, 2));
      return {
        success: false,
        provider: 'cloud_api',
        status: response.status,
        errorCode: data?.error?.code,
        errorMessage: data?.error?.message || 'Error desconocido en Meta API'
      };
    }

    return {
      success: true,
      provider: 'cloud_api',
      providerMessageId: data?.messages?.[0]?.id || `wamid_unknown_${Date.now()}`
    };
  } catch (error) {
    console.error('[WhatsApp Cloud Error]:', error.message);
    return {
      success: false,
      provider: 'cloud_api',
      errorMessage: error.message
    };
  }
}

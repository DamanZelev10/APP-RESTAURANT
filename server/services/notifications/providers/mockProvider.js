/**
 * Mock Provider for local development without network overhead
 */
export async function sendWhatsAppText({ to, body, previewUrl = true }) {
  // Sanitize any token from logs
  const sanitizedBody = body.replace(/token=[A-Za-z0-9_-]+/g, 'token=[REDACTED]');
  
  console.log('--- [MOCK WHATSAPP] ---');
  console.log(`To: ${to.replace(/.(?=.{4})/g, '*')}`); // Mask phone number except last 4 digits
  console.log(`Length: ${body.length} chars`);
  console.log(`Preview URL: ${previewUrl}`);
  console.log(`Content:\n${sanitizedBody}`);
  console.log('-----------------------');

  return {
    success: true,
    provider: 'mock',
    providerMessageId: `mock_${Date.now()}`
  };
}

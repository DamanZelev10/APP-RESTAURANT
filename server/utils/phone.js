/**
 * Utility for normalizing Colombian phone numbers
 * Standardizes numbers to E.164 format (+57...)
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  
  // Remover todo excepto dígitos
  let digits = phone.replace(/\D/g, '');
  
  // Si comienza con 57 y tiene 12 dígitos, ya tiene el código de país
  if (digits.startsWith('57') && digits.length === 12) {
    return '+' + digits;
  }
  
  // Si comienza con 0 y tiene 11 dígitos (ej. 03001234567), remover 0 y añadir +57
  if (digits.startsWith('0') && digits.length === 11) {
    return '+57' + digits.substring(1);
  }
  
  // Si tiene 10 dígitos, añadir +57
  if (digits.length === 10) {
    return '+57' + digits;
  }
  
  // Fallback para otros formatos internacionales
  return '+' + digits;
}

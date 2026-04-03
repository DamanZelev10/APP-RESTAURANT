/**
 * Utility for normalizing Colombian phone numbers
 * Standardizes numbers to E.164 format (+57...)
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  let digits = phone.replace(/\D/g, '');
  
  // If it starts with 57 and has 12 digits, it's likely already prefixed (57 300...)
  if (digits.startsWith('57') && digits.length === 12) {
    return '+' + digits;
  }
  
  // If it starts with 0 (often people put 0300...) remove the 0
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.substring(1);
  }
  
  // If it's a 10-digit number, prefix with +57
  if (digits.length === 10) {
    return '+57' + digits;
  }
  
  // Fallback: just return digits with + if not present
  return phone.startsWith('+') ? phone : '+' + digits;
}

/**
 * Utility for normalizing Colombian phone numbers (Frontend)
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  let digits = phone.replace(/\D/g, '');
  
  // If it starts with 57 and has 12 digits, it's likely already prefixed
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
  
  // Fallback
  return digits.startsWith('+') ? digits : '+' + digits;
}

export function formatPhoneForDisplay(phone) {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('57')) digits = digits.substring(2);
  
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  return phone;
}

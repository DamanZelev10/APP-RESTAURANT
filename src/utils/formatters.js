/**
 * Converts HH:MM (24h) string into HH:MM AM/PM
 * @param {string} time24 - Time in 24h format (e.g. "19:00" or "08:30")
 * @returns {string} - Time in 12h format (e.g. "7:00 PM")
 */
export function format12h(time24) {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12; // 00:xx is 12:xx AM
  const min = (minuteStr || '00').padStart(2, '0');
  return `${hour}:${min} ${ampm}`;
}

/**
 * Normalizes a phone number for direct wa.me link
 * Removes spaces, dashes, etc. Prepends 57 if no country code.
 * @param {string} phone 
 * @returns {string} Clean number
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  // Assume default country code is 57 if number length is 10 (typical Colombian standard cell length)
  if (clean.length === 10 && !clean.startsWith('57')) {
    clean = `57${clean}`;
  }
  return clean;
}

/**
 * Generates the wa.me deep link
 * @param {string} phone 
 * @param {string} message 
 * @returns {string} url
 */
export function generateWhatsAppDeepLink(phone, message) {
  const cleanPhone = normalizePhone(phone);
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Check if a simple date string "YYYY-MM-DD" matches today locally
 * @param {string} dateString 
 * @returns {boolean}
 */
export function isTodayLocal(dateString) {
  if (!dateString) return false;
  return dateString === getLocalDateString();
}

/**
 * Gets the current local date as "YYYY-MM-DD" safely using America/Bogota timezone
 * @param {Date} date Optional date to format
 * @returns {string}
 */
export function getLocalDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

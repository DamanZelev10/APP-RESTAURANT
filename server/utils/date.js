/**
 * Gets the current date in Bogotá as a YYYY-MM-DD string
 * @returns {string}
 */
export function getBogotaDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Gets the current time in Bogotá as an HH:MM string (24h)
 * @returns {string}
 */
export function getBogotaTimeString(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Returns a Date object representing the current moment and another for 1 hour ago/ahead in Bogota context
 * Since JS Date objects are always UTC internally, we use this to compare YYYY-MM-DD + HH:MM accurately.
 */
export function getBogotaDateTime(date = new Date()) {
    // This returns the date object. To compare with reservationDate/Time,
    // we should usually convert the reservation to a Date object in Bogota timezone.
    return date; 
}

/**
 * Converts a Bogotá date/time string pair into a JS Date object correctly interpreted as Bogotá time.
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} timeStr HH:MM
 * @returns {Date}
 */
export function parseBogotaDateTime(dateStr, timeStr) {
  // Create a ISO string like "2024-04-02T19:00:00-05:00"
  // Colombia is always UTC-5
  return new Date(`${dateStr}T${timeStr}:00-05:00`);
}

/**
 * Converts HH:mm (24h) string to h:mm AM/PM (12h) string
 * @param {string} timeStr HH:mm
 * @returns {string}
 */
export function format12h(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minutes} ${ampm}`;
}

/**
 * Get the current Date object but adjusted or for comparison in Bogota
 */
export function getNowBogota() {
  return new Date();
}

import crypto from 'crypto';

/**
 * Generates a random secure token and its SHA-256 hash.
 * 
 * @returns {Object} { token: String, tokenHash: String }
 */
export function generatePortalToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

/**
 * Generates the SHA-256 hash for a given token.
 * Use this to verify tokens against the database.
 * 
 * @param {String} token - The plaintext token.
 * @returns {String} The SHA-256 hash.
 */
export function hashPortalToken(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

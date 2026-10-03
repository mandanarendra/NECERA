import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'necera-engineering-edtech-jwt-secret-2026-secure-key';

/**
 * Hash password with PBKDF2 using SHA-512 and 100,000 iterations.
 * Cryptographically secure, resists GPU/ASIC rainbow table attacks.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify plaintext password against stored hash and salt in constant time.
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  try {
    const candidateHash = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512').toString('hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    const candidateBuffer = Buffer.from(candidateHash, 'hex');
    if (storedBuffer.length !== candidateBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(storedBuffer, candidateBuffer);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Create a signed, stateless session token (HMAC-SHA256).
 * Compatible with Web browsers and Flutter/Mobile applications.
 */
export function createSessionToken(payload: Record<string, any>, expiresInHours = 72): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode session token.
 */
export function verifySessionToken<T = any>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload as T;
  } catch (err) {
    return null;
  }
}

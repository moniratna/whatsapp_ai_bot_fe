import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'aureva_admin_session';
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

function sessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) throw new Error('AUTH_SESSION_SECRET is not configured.');
  return secret;
}

export function createSessionToken(now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + SESSION_LIFETIME_SECONDS;
  const payload = `admin:${expiresAt}`;
  const signature = createHmac('sha256', sessionSecret()).update(payload).digest('hex');
  return `${payload}:${signature}`;
}

export function isValidSessionToken(token: string | undefined, now = Date.now()) {
  if (!token) return false;
  const [role, expiresText, signature, extra] = token.split(':');
  if (role !== 'admin' || !expiresText || !signature || extra) return false;
  const expiresAt = Number(expiresText);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;
  const payload = `${role}:${expiresText}`;
  const expected = createHmac('sha256', sessionSecret()).update(payload).digest();
  let actual: Buffer;
  try { actual = Buffer.from(signature, 'hex'); } catch { return false; }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function credentialsMatch(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  return Boolean(expectedUsername && expectedPassword && username === expectedUsername && password === expectedPassword);
}

export const sessionLifetimeSeconds = SESSION_LIFETIME_SECONDS;

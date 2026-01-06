import { createHash } from 'crypto';

interface FingerprintData {
  userAgent: string;
  acceptLanguage: string;
  ip: string;
}

/**
 * Generate a server-side fingerprint from request data.
 * Includes the current date to create daily "sessions".
 */
export function generateFingerprint(data: FingerprintData): string {
  const components = [
    data.userAgent || '',
    data.acceptLanguage || '',
    // Include day of year to create daily "sessions"
    new Date().toISOString().split('T')[0],
  ].join('|');

  return createHash('sha256').update(components).digest('hex').substring(0, 32);
}

/**
 * Hash a client-provided fingerprint for consistent storage.
 */
export function hashClientFingerprint(clientFingerprint: string): string {
  return createHash('sha256').update(clientFingerprint).digest('hex').substring(0, 32);
}

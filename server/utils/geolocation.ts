export interface GeoData {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
}

// Cache to avoid hitting rate limits (ip-api.com allows 45 req/min)
const geoCache = new Map<string, { data: GeoData; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get geolocation data from IP address using ip-api.com (free, no API key required).
 * Rate limit: 45 requests/minute.
 */
export async function getGeolocation(ip: string): Promise<GeoData> {
  // Skip for localhost/private IPs
  if (isPrivateIP(ip)) {
    return { country: null, countryCode: null, city: null, region: null };
  }

  // Check cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // ip-api.com - free, no API key, 45 req/min
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city`
    );
    const data = await response.json();

    if (data.status === 'success') {
      const geoData: GeoData = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
      };
      geoCache.set(ip, { data: geoData, timestamp: Date.now() });
      return geoData;
    }
  } catch (error) {
    console.error('Geolocation lookup failed:', error);
  }

  return { country: null, countryCode: null, city: null, region: null };
}

/**
 * Check if an IP address is private/local.
 */
function isPrivateIP(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('fc00:') ||
    ip.startsWith('fd00:') ||
    ip.startsWith('fe80:')
  );
}

/**
 * Get client IP from request, handling proxies and Cloud Run.
 */
export function getClientIP(req: {
  headers: { [key: string]: string | string[] | undefined };
  socket?: { remoteAddress?: string };
  ip?: string;
}): string {
  // Check X-Forwarded-For header (set by proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }

  // Fall back to socket remote address or express ip
  return req.socket?.remoteAddress || req.ip || '0.0.0.0';
}

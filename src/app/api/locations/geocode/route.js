import { NextResponse } from 'next/server';

// Simple in-memory cache for geocoding results
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // Cache geocoding for 7 days (addresses are static)

/**
 * GET /api/locations/geocode?q=...
 * Proxy for Nominatim geocoding
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
  }

  const cacheKey = `geocode-${q.toLowerCase().trim()}`;
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }
    cache.delete(cacheKey);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5&countrycodes=bd&accept-language=en`,
      {
        headers: {
          'User-Agent': 'ShwapnerThikanaProject/1.0 (contact@shwapnerthikana.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: now
    });

    // Cleanup cache if it grows too large
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 503 });
  }
}

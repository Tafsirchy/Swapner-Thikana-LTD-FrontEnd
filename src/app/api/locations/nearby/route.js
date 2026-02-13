import { NextResponse } from 'next/server';

// Simple in-memory cache: Map<string, { data: any, timestamp: number }>
const cache = new Map();
// Cache duration: 24 hours (data rarely changes)
const CACHE_TTL = 1000 * 60 * 60 * 24; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  // Default search radius: 5km (sufficient for most amenities)
  const radius = searchParams.get('radius') || 5000;

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude' },
      { status: 400 }
    );
  }

  // Generate a unique cache key based on location and radius
  const cacheKey = `${lat}-${lng}-${radius}`;
  const now = Date.now();

  // Check if valid data exists in cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL) {
      // Return cached data immediately
      return NextResponse.json(cached.data);
    }
    // Remove stale data
    cache.delete(cacheKey);
  }

  // Construct Overpass API query for all desired categories
  // This reduces multiple frontend calls to a single backend request
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"school|university|college|hospital|clinic|pharmacy"](around:${radius},${lat},${lng});
      node["shop"~"supermarket|mall|convenience"](around:${radius},${lat},${lng});
      node["leisure"~"park|garden|playground"](around:${radius},${lat},${lng});
      node["highway"~"bus_stop"](around:${radius},${lat},${lng});
      node["public_transport"~"stop_position"](around:${radius},${lat},${lng});
    );
    out body;
  `;

  // Failover mechanism: Try multiple reliable Overpass API servers
  const servers = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

  for (const server of servers) {
    try {
      // Fetch data from external API with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${server}?data=${encodeURIComponent(query)}`, {
        signal: controller.signal,
        headers: {
            'User-Agent': 'ShwapnerThikanaProject/1.0', // Polite identification
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) continue; // Try next server if this one fails

      const data = await response.json();
      
      // Store successful response in cache
      cache.set(cacheKey, {
        data,
        timestamp: now
      });

      // Simple LRU-like eviction prevent indefinite memory growth
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value; // Get oldest inserted key
        cache.delete(firstKey);
      }

      return NextResponse.json(data);
    } catch (error) {
      console.warn(`Failed to fetch from ${server}:`, error.message);
      // Continue to next server in list
    }
  }

  // If all servers fail
  return NextResponse.json(
    { error: 'Failed to fetch location data from all providers' },
    { status: 503 }
  );
}

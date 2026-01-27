export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.FRONTEND_URL || 'https://shwapnerthikana.com';

  // Static Routes
  const routes = [
    '',
    '/about',
    '/properties',
    '/contact',
    '/agents',
    '/blog'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  try {
    // Fetch dynamic property routes
    // Note: Fetching ALL properties might be heavy. For sitemap, usually we want a lighter endpoint or pagination.
    // For now, assuming standard get call works or we limit to recent 1000.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?limit=1000`);
    const data = await res.json();
    const properties = data.data.properties || [];

    const propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt || new Date().toISOString(),
    }));

    return [...routes, ...propertyRoutes];
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return routes;
  }
}

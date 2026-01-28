import api from '@/lib/api';

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
    const data = await api.properties.getAll({ limit: 1000 });
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

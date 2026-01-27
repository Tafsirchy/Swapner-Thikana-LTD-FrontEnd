export default function robots() {
  const baseUrl = process.env.FRONTEND_URL || 'https://shwapnerthikana.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/auth/', '/unauthorized'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

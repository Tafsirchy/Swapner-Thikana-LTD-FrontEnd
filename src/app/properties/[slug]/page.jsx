import api from '@/lib/api';
import PropertyDetailClient from '@/components/property/PropertyDetailClient';
import StructuredData from '@/components/seo/StructuredData';

// This is a Server Component
const PropertyDetailPage = async ({ params }) => {
  const { slug } = await params;
  let property = null;
  
  try {
    // Using the same API library as the client for consistency and better error handling
    const res = await api.properties.getBySlug(slug);
    property = res.data.property;
  } catch (error) {
    console.error('Error fetching property by slug:', error);
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-royal-deep text-zinc-400">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Property Not Found</h1>
          <p>The property you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData type="RealEstateListing" data={property} />
      <StructuredData 
        type="BreadcrumbList" 
        data={{
          items: [
            { name: 'Home', path: '/' },
            { name: 'Properties', path: '/properties' },
            { name: property.title, path: `/properties/${slug}` }
          ]
        }} 
      />
      <PropertyDetailClient initialProperty={property} />
    </>
  );
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await api.properties.getBySlug(slug);
    const property = res.data.property;

    if (!property) {
        return {
            title: 'Property Not Found | shwapner Thikana Ltd',
        }
    }

    return {
      title: `${property.title} | shwapner Thikana Ltd`,
      description: property.description?.substring(0, 160) || 'Luxury property for sale in Dhaka.',
      openGraph: {
        title: property.title,
        description: property.description?.substring(0, 160),
        images: property.images?.[0] ? [property.images[0]] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: property.title,
        description: property.description?.substring(0, 160),
        images: property.images?.[0] ? [property.images[0]] : [],
      },
      alternates: {
        canonical: `https://shwapner-thikana.com/properties/${slug}`,
      },
    };
  } catch {
    return {
      title: 'shwapner Thikana Ltd - Luxury Real Estate',
    };
  }
}

export default PropertyDetailPage;

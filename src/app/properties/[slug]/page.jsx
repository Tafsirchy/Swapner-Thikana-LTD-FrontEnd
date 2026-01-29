import api from '@/lib/api';
import PropertyDetailClient from '@/components/property/PropertyDetailClient';
import StructuredData from '@/components/seo/StructuredData';
import Link from 'next/link';

// This is a Server Component
const PropertyDetailPage = async ({ params }) => {
  const { slug } = await params;
  let property = null;
  let apiErrorType = null;
  
  console.log(`[PropertyDetailPage] Fetching slug: ${slug}`);

  // Handle "undefined" slug string which can occur from broken links
  if (!slug || slug === 'undefined') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-royal-deep text-zinc-400 p-4">
        <h1 className="text-2xl font-bold text-zinc-100 mb-4">Invalid Property Link</h1>
        <p className="mb-6">The link you followed appears to be broken. Please return to the listings page.</p>
        <Link 
          href="/properties"
          className="px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all"
        >
          View All Properties
        </Link>
      </div>
    );
  }
  
  try {
    // Using the same API library as the client for consistency and better error handling
    const res = await api.properties.getBySlug(slug);
    console.log(`[PropertyDetailPage] API Success for ${slug}:`, !!res.data.property);
    property = res.data.property;
  } catch (error) {
    apiErrorType = error.response ? `HTTP ${error.response.status}` : error.message;
    console.error(`[PropertyDetailPage] API Error for ${slug}:`, error.message);
    if (error.response) {
      console.error(`[PropertyDetailPage] Error Response Status:`, error.response.status);
      console.error(`[PropertyDetailPage] Error Response Data:`, error.response.data);
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-royal-deep text-zinc-400 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">Property Not Found</h1>
          <p className="mb-8">The property you are looking for does not exist, has been removed, or a server communication error occurred.</p>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-left font-mono">
             <p className="text-zinc-500 mb-2">Diagnostic Info:</p>
             <p>Slug: <span className="text-brand-gold">{slug}</span></p>
             <p>Env: <span className="text-brand-gold">{process.env.NODE_ENV}</span></p>
             <p>API Base URL: <span className="text-brand-gold">{process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : 'MISSING (Fallback used)'}</span></p>
             {apiErrorType && <p>API Error Type: <span className="text-red-400">{apiErrorType}</span></p>}
          </div>

          <Link 
            href="/properties"
            className="mt-10 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all inline-block"
          >
            Back to All Properties
          </Link>
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

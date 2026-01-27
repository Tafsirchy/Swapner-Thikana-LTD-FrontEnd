
import React from 'react';
import PropertyDetailClient from '@/components/property/PropertyDetailClient';

// This is a Server Component
const PropertyDetailPage = async ({ params }) => {
  const { slug } = params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/slug/${slug}`, {
      cache: 'no-store' // Ensure fresh data, or use 'force-cache' / next: { revalidate: 60 } for ISR
    });

    if (!res.ok) {
      throw new Error('Failed to fetch property');
    }

    const data = await res.json();
    const property = data.data.property;

    return <PropertyDetailClient initialProperty={property} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-royal-deep text-zinc-400">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Property Not Found</h1>
          <p>The property you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/slug/${slug}`);
    const data = await res.json();
    const property = data.data.property;

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
    };
  } catch (error) {
    return {
      title: 'shwapner Thikana Ltd - Luxury Real Estate',
    };
  }
}

export default PropertyDetailPage;

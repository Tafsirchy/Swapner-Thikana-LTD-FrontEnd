'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowLeft, CheckCircle2, XCircle, Download, FileSpreadsheet } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { exportComparisonPDF, exportPropertiesCSV } from '@/utils/exportUtils';
import SocialShare from '@/components/shared/SocialShare';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      fetchProperties(ids.split(','));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProperties = async (ids) => {
    try {
      setLoading(true);
      const results = await Promise.all(
        ids.map(id => api.properties.getById(id).catch(() => null))
      );
      setProperties(results.filter(p => p?.data?.property).map(p => p.data.property));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id) => {
    const newProperties = properties.filter(p => p._id !== id);
    setProperties(newProperties);
    
    if (newProperties.length === 0) {
      window.location.href = '/properties';
    } else {
      const newIds = newProperties.map(p => p._id).join(',');
      window.history.pushState({}, '', `/compare?ids=${newIds}`);
    }
  };

  const comparisonRows = [
    { label: 'Price', key: 'price', format: (val) => `৳${val?.toLocaleString('en-BD')}` },
    { label: 'Listing Type', key: 'listingType', format: (val) => val === 'sale' ? 'For Sale' : 'For Rent' },
    { label: 'Property Type', key: 'propertyType' },
    { label: 'Bedrooms', key: 'bedrooms', format: (val) => `${val} Beds` },
    { label: 'Bathrooms', key: 'bathrooms', format: (val) => `${val} Baths` },
    { label: 'Area', key: 'size', format: (val) => `${val?.toLocaleString('en-BD')} sqft` },
    { label: 'Location', key: 'location', format: (val) => `${val?.area}, ${val?.city}` },
    { label: 'Address', key: 'location', format: (val) => val?.address },
    { label: 'Featured', key: 'featured', format: (val) => val ? '✓' : '✗' },
    { label: 'Status', key: 'status', format: (val) => val || 'Available' },
  ];

  // Amenities comparison
  const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))];

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-royal-deep flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">No Properties to Compare</h1>
          <p className="text-zinc-400 mb-8">Add properties from the listing page to compare them.</p>
          <Link href="/properties" className="px-6 py-3 bg-brand-gold text-royal-deep rounded-xl font-medium hover:bg-brand-gold-light transition-all inline-block">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-deep pt-24 pb-20">
      <div className="max-container px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/properties" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors mb-6">
            <ArrowLeft size={18} />
            Back to Properties
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Compare Properties</h1>
              <p className="text-zinc-400">Compare up to 4 properties side-by-side</p>
            </div>
            {properties.length >= 2 && (
              <div className="flex items-center gap-3">
                <SocialShare 
                  url={typeof window !== 'undefined' ? window.location.href : ''} 
                  title={`Compare: ${properties.map(p => p.title).join(' vs ')}`}
                />
                <button
                  onClick={() => exportPropertiesCSV(properties)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 transition-all"
                >
                  <FileSpreadsheet size={18} className="text-brand-gold" />
                  Export CSV
                </button>
                <button
                  onClick={() => exportComparisonPDF(properties)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/20 transition-all"
                >
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="glass rounded-3xl border-white/10 overflow-hidden">
              <table className="min-w-full divide-y divide-white/10">
                {/* Property Images & Titles */}
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-royal-deep px-6 py-4 text-left">
                      <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Features</span>
                    </th>
                    {properties.map((property) => (
                      <th key={property._id} className="px-6 py-4 min-w-[280px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProperty(property._id)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors z-10"
                          >
                            <X size={16} className="text-white" />
                          </button>
                          <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                            <Image
                              src={property.images?.[0] || '/placeholder.jpg'}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-bold text-zinc-100 text-sm mb-2 line-clamp-2">{property.title}</h3>
                          <Link
                            href={`/properties/${property.slug}`}
                            className="text-xs text-brand-gold hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Comparison Rows */}
                <tbody className="divide-y divide-white/5">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="sticky left-0 z-10 bg-royal-deep px-6 py-4 text-sm font-medium text-zinc-400 border-r border-white/5">
                        {row.label}
                      </td>
                      {properties.map((property) => {
                        const value = row.key.split('.').reduce((obj, key) => obj?.[key], property);
                        const formattedValue = row.format ? row.format(value) : value;
                        
                        return (
                          <td key={property._id} className="px-6 py-4 text-sm text-zinc-100 font-medium">
                            {formattedValue || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Amenities Section */}
                  <tr className="bg-white/[0.02]">
                    <td colSpan={properties.length + 1} className="px-6 py-3">
                      <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Amenities</h4>
                    </td>
                  </tr>
                  {allAmenities.map((amenity, idx) => (
                    <tr key={amenity} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="sticky left-0 z-10 bg-royal-deep px-6 py-3 text-sm text-zinc-400 border-r border-white/5">
                        {amenity}
                      </td>
                      {properties.map((property) => {
                        const hasAmenity = property.amenities?.includes(amenity);
                        return (
                          <td key={property._id} className="px-6 py-3 text-center">
                            {hasAmenity ? (
                              <CheckCircle2 size={20} className="text-green-500 mx-auto" />
                            ) : (
                              <XCircle size={20} className="text-zinc-600 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

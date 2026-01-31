'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowLeft, CheckCircle2, XCircle, Download, FileSpreadsheet } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { exportComparisonPDF, exportPropertiesCSV } from '@/utils/exportUtils';
import SocialShare from '@/components/shared/SocialShare';

function CompareContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      fetchItems(ids.split(','));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchItems = async (ids) => {
    try {
      setLoading(true);
      const results = await Promise.all(
        ids.map(async (id) => {
          // Attempt properties first
          try {
            const res = await api.properties.getById(id);
            if (res.data?.property) return { ...res.data.property, itemType: 'property' };
          } catch { /* ignore */ }
          
          // Then projects
          try {
            const res = await api.projects.getById(id);
            if (res.data?.project) return { ...res.data.project, itemType: 'project' };
          } catch { /* ignore */ }
          
          return null;
        })
      );
      setProperties(results.filter(Boolean));
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load comparison items');
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
    { label: 'Type', key: 'itemType', format: (val) => val === 'property' ? 'Property' : 'Project' },
    { label: 'Price', key: 'price', format: (val) => val ? `৳${val?.toLocaleString('en-BD')}` : 'N/A' },
    { label: 'Listing/Status', key: 'status', format: (val, item) => item.listingType ? (item.listingType === 'sale' ? 'For Sale' : 'For Rent') : (val || 'N/A') },
    { label: 'Property Type', key: 'propertyType', format: (val) => val || 'N/A' },
    { label: 'Bedrooms', key: 'bedrooms', format: (val) => val ? `${val} Beds` : 'N/A' },
    { label: 'Bathrooms', key: 'bathrooms', format: (val) => val ? `${val} Baths` : 'N/A' },
    { label: 'Area', key: 'size', format: (val, item) => (val || item.area) ? `${(val || item.area)?.toLocaleString('en-BD')} sqft` : 'N/A' },
    { label: 'Location', key: 'location', format: (val) => val ? `${val.area || val.city}, ${val.city || ''}` : 'N/A' },
    { label: 'Completion', key: 'completionDate', format: (val) => val || 'N/A' },
    { label: 'Featured', key: 'featured', format: (val) => val ? '✓' : '-' },
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
        <div className="mb-6 md:mb-8">
          <Link href="/properties" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors my-4 md:my-6 text-sm md:text-base">
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
            Back to Properties
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-zinc-100 mb-2">Compare Properties</h1>
              <p className="text-zinc-400 text-sm md:text-base">Compare up to 4 properties side-by-side</p>
            </div>
            {properties.length >= 2 && (
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <SocialShare 
                  url={typeof window !== 'undefined' ? window.location.href : ''} 
                  title={`Compare: ${properties.map(p => p.title).join(' vs ')}`}
                />
                <button
                  onClick={() => exportPropertiesCSV(properties)}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 transition-all text-xs md:text-sm"
                >
                  <FileSpreadsheet size={16} className="text-brand-gold md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>
                <button
                  onClick={() => exportComparisonPDF(properties)}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/20 transition-all text-xs md:text-sm"
                >
                  <Download size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full align-middle">
            <div className="glass rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden">
              <table className="min-w-full divide-y divide-white/10">
                {/* Property Images & Titles */}
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-royal-deep px-3 py-3 md:px-6 md:py-4 text-left border-r border-white/5 min-w-[120px] md:min-w-[150px]">
                      <span className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider">Features</span>
                    </th>
                    {properties.map((property) => (
                      <th key={property._id} className="px-3 py-3 md:px-6 md:py-4 min-w-[200px] md:min-w-[280px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProperty(property._id)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors z-10"
                          >
                            <X size={14} className="text-white md:w-4 md:h-4" />
                          </button>
                          <div className="relative h-28 md:h-40 rounded-xl overflow-hidden mb-3 md:mb-4">
                            <Image
                              src={property.images?.[0] || '/placeholder.jpg'}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-bold text-zinc-100 text-xs md:text-sm mb-2 line-clamp-2 min-h-[32px] md:min-h-[40px]">{property.title}</h3>
                          <Link
                            href={property.itemType === 'property' ? `/properties/${property.slug}` : `/projects/${property.slug}`}
                            className="text-[10px] md:text-xs text-brand-gold hover:underline"
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
                      <td className="sticky left-0 z-10 bg-royal-deep px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm font-medium text-zinc-400 border-r border-white/5">
                        {row.label}
                      </td>
                      {properties.map((property) => {
                        const value = row.key.split('.').reduce((obj, key) => obj?.[key], property);
                        const formattedValue = row.format ? row.format(value, property) : value;
                        
                        return (
                          <td key={property._id} className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-zinc-100 font-medium whitespace-nowrap md:whitespace-normal">
                            {formattedValue || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Amenities Section */}
                  <tr className="bg-white/[0.02]">
                    <td colSpan={properties.length + 1} className="px-3 py-3 md:px-6 md:py-3">
                      <h4 className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider">Amenities</h4>
                    </td>
                  </tr>
                  {allAmenities.map((amenity, idx) => (
                    <tr key={amenity} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="sticky left-0 z-10 bg-royal-deep px-3 py-3 md:px-6 md:py-3 text-xs md:text-sm text-zinc-400 border-r border-white/5">
                        {amenity}
                      </td>
                      {properties.map((property) => {
                        const hasAmenity = property.amenities?.includes(amenity);
                        return (
                          <td key={property._id} className="px-3 py-3 md:px-6 md:py-3 text-center">
                            {hasAmenity ? (
                              <CheckCircle2 size={16} className="text-green-500 mx-auto md:w-5 md:h-5" />
                            ) : (
                              <XCircle size={16} className="text-zinc-600 mx-auto md:w-5 md:h-5" />
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

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-royal-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-gold"></div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}

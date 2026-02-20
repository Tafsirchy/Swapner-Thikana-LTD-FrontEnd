import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const PropertyDetailLoading = () => {
  return (
    <div className="min-h-screen bg-royal-deep pt-20 md:pt-24 pb-32 md:pb-20">
      {/* Hero Gallery Skeleton */}
      <section className="relative h-[45vh] md:h-[70vh] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent opacity-60 md:opacity-100 z-10"></div>
      </section>

      <div className="max-container px-4 -mt-10 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6 md:space-y-10">
            {/* Title & Price Header Shell */}
            <div className="p-6 md:p-10 glass rounded-[2rem] md:rounded-[3rem] border-white/10">
              <div className="flex gap-3 mb-6">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <Skeleton className="w-3/4 h-12 rounded-xl" />
                  <Skeleton className="w-1/2 h-6 rounded-lg" />
                </div>
                <div className="space-y-2 md:text-right">
                  <Skeleton className="w-24 h-4 ml-0 md:ml-auto" />
                  <Skeleton className="w-40 h-10 ml-0 md:ml-auto" />
                </div>
              </div>

              {/* Quick Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-white/5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="w-12 h-4" />
                      <Skeleton className="w-16 h-3 opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Block Shell */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 space-y-6">
              <Skeleton className="w-48 h-8 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            <Skeleton className="w-full h-24 rounded-2xl" />
            <div className="p-8 glass rounded-[2.5rem] border-brand-gold/20 space-y-6">
              <Skeleton className="w-40 h-8 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-32 rounded-xl" />
                <Skeleton className="w-full h-14 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailLoading;

import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const ProjectDetailLoading = () => {
  return (
    <div className="min-h-screen bg-royal-deep pt-16 md:pt-24 pb-32 md:pb-20">
      {/* 1. Immersive Hero Gallery Skeleton */}
      <section className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-royal-deep to-transparent z-10"></div>
      </section>

      <div className="max-container px-4 md:px-6 relative z-10 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Main Content Pillar Skeleton */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Content Skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-32 h-6 rounded-full" />
              <Skeleton className="w-3/4 h-12 md:h-16 rounded-xl" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-1/2 h-6 rounded-lg" />
              </div>
            </div>

            {/* Content Shell Skeleton */}
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="w-16 h-3 opacity-50" />
                            <Skeleton className="w-24 h-5" />
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/10 pt-8 space-y-4">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                </div>
            </div>
            
            {/* Gallery Skeleton */}
            <div className="space-y-6 pt-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="w-32 h-8" />
                    <Skeleton className="w-20 h-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Skeleton className="col-span-2 row-span-2 h-64 md:h-[28rem] rounded-[2rem]" />
                    <Skeleton className="h-32 md:h-52 rounded-2xl" />
                    <Skeleton className="h-32 md:h-52 rounded-2xl" />
                </div>
            </div>
          </div>

          {/* Lateral Column Skeleton */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="space-y-6">
              <div className="p-8 glass bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 space-y-8">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-5" />
                    <Skeleton className="w-32 h-4 opacity-50" />
                  </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="w-full h-16 rounded-2xl" />
                    <Skeleton className="w-full h-16 rounded-2xl" />
                </div>
                <div className="pt-8 border-t border-white/5 space-y-4">
                    <Skeleton className="w-full h-12 rounded-2xl" />
                    <Skeleton className="w-full h-12 rounded-2xl" />
                    <Skeleton className="w-full h-12 rounded-2xl" />
                    <Skeleton className="w-full h-14 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailLoading;

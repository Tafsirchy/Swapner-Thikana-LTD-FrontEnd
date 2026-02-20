import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const BlogCardSkeleton = () => {
  return (
    <div className="bg-[#0a0f1a] border border-white/5 rounded-none overflow-hidden h-full flex flex-col relative group">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Floating Category Badge Skeleton */}
        <div className="absolute top-6 left-6 z-20">
          <Skeleton className="w-24 h-8" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="relative px-8 pb-5 pt-8 flex-1 flex flex-col">
        {/* Date/Author Glass Panel Skeleton */}
        <div className="absolute -top-5 left-4 right-4 sm:left-8 sm:right-8 bg-zinc-950/80 backdrop-blur-xl border border-white/5 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-20 h-3" />
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>

        {/* Title and Excerpt Skeletons */}
        <div className="flex flex-col flex-1">
          <Skeleton className="w-full h-8 mb-4 mt-2" />
          <Skeleton className="w-11/12 h-4 mb-2" />
          <Skeleton className="w-4/5 h-4 mb-6" />

          {/* Footer Action Skeleton */}
          <div className="mt-auto pt-3 border-t border-white/5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-8 h-8 rounded-full ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;

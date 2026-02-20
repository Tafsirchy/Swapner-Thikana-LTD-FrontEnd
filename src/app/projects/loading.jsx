export default function Loading() {
  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="w-48 h-10 bg-white/5 animate-pulse mb-4"></div>
          <div className="w-1/2 h-6 bg-white/5 animate-pulse"></div>
        </div>

        {/* Filters/Search Skeleton */}
        <div className="w-full h-20 bg-white/5 animate-pulse mb-12"></div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full aspect-[16/9] bg-white/5 animate-pulse"></div>
              <div className="w-3/4 h-6 bg-white/5 animate-pulse"></div>
              <div className="w-1/2 h-4 bg-white/5 animate-pulse"></div>
              <div className="w-full h-12 bg-white/5 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

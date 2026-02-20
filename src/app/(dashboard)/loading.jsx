export default function Loading() {
  return (
    <div className="w-full p-4 md:p-8 space-y-8 animate-pulse text-zinc-100 min-h-[calc(100vh-80px)]">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-white/5 rounded-none"></div>
        <div className="h-4 w-64 bg-white/5 rounded-none"></div>
      </div>
      
      {/* Search Bar / Quick Action Skeleton */}
      <div className="flex gap-4 mb-8">
        <div className="h-12 flex-1 bg-white/5 rounded-none"></div>
        <div className="h-12 w-32 bg-white/5 rounded-none"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 p-6 flex flex-col justify-between border border-white/5 rounded-none">
            <div className="h-4 w-24 bg-white/10"></div>
            <div className="h-8 w-16 bg-white/10"></div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area Skeleton */}
      <div className="h-96 mt-8 bg-white/5 rounded-none border border-white/5 w-full"></div>
    </div>
  );
}

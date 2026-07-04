export const SkeletonCard = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft flex flex-col gap-4 overflow-hidden relative">
      <div className="w-1/3 h-6 rounded-md skeleton-shimmer"></div>
      <div className="w-full h-24 rounded-xl skeleton-shimmer"></div>
      <div className="flex justify-between items-center mt-2">
        <div className="w-1/4 h-5 rounded-md skeleton-shimmer"></div>
        <div className="w-1/5 h-8 rounded-full skeleton-shimmer"></div>
      </div>
    </div>
  );
};

export const SkeletonList = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white relative overflow-hidden">
          <div className="w-10 h-10 rounded-full skeleton-shimmer flex-shrink-0"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="w-1/4 h-5 rounded-md skeleton-shimmer"></div>
            <div className="w-1/2 h-4 rounded-md skeleton-shimmer"></div>
          </div>
          <div className="w-12 h-6 rounded-md skeleton-shimmer flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft flex flex-col items-center gap-6 relative overflow-hidden">
      <div className="w-24 h-24 rounded-full skeleton-shimmer"></div>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-1/3 h-6 rounded-md skeleton-shimmer"></div>
        <div className="w-1/4 h-4 rounded-md skeleton-shimmer"></div>
      </div>
      <div className="w-full border-t border-slate-100 pt-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="w-1/4 h-5 rounded-md skeleton-shimmer"></div>
          <div className="w-1/3 h-5 rounded-md skeleton-shimmer"></div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/4 h-5 rounded-md skeleton-shimmer"></div>
          <div className="w-1/3 h-5 rounded-md skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

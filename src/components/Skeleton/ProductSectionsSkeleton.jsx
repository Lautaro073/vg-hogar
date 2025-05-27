import React from 'react';

function ProductSectionsSkeleton() {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="h-8 bg-marron/20 rounded w-1/3 mb-4"></div>
              <div className="flex gap-4 overflow-hidden">                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="flex-shrink-0 w-[260px]">
                    <div className="h-[156px] bg-marron/10 rounded-t-lg"></div>
                    <div className="p-3 space-y-2 bg-crema-oscuro rounded-b-lg">
                      <div className="h-4 bg-marron/20 rounded"></div>
                      <div className="h-3 bg-marron/10 rounded w-2/3"></div>
                      <div className="h-8 bg-marron/20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSectionsSkeleton;

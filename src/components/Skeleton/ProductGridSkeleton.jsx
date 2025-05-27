import React from 'react';

function ProductGridSkeleton({ count = 8, showTitle = false }) {
  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {showTitle && (
            <div className="h-8 bg-marron/20 rounded w-1/3 mb-6"></div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="group">
                <div className="h-[240px] bg-marron/10 rounded-t-lg"></div>
                <div className="p-3 space-y-2 bg-crema-oscuro rounded-b-lg border border-t-0 border-marron/10">
                  <div className="h-4 bg-marron/20 rounded"></div>
                  <div className="h-3 bg-marron/10 rounded w-3/4"></div>
                  <div className="h-8 bg-marron/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGridSkeleton;

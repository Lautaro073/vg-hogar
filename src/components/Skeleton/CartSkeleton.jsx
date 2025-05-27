import React from 'react';

function CartSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 bg-marron/20 rounded w-1/3 mb-8"></div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 bg-crema-oscuro rounded-lg border border-marron/10">
              {/* Product image skeleton */}
              <div className="w-20 h-20 bg-marron/10 rounded"></div>
              
              {/* Product details skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-marron/20 rounded w-3/4"></div>
                <div className="h-4 bg-marron/10 rounded w-1/2"></div>
              </div>
              
              {/* Quantity controls skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-marron/20 rounded"></div>
                <div className="w-12 h-8 bg-marron/10 rounded"></div>
                <div className="w-8 h-8 bg-marron/20 rounded"></div>
              </div>
              
              {/* Price skeleton */}
              <div className="w-20 h-6 bg-marron/20 rounded"></div>
              
              {/* Remove button skeleton */}
              <div className="w-8 h-8 bg-marron/20 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Total section skeleton */}
        <div className="mt-8 p-6 bg-crema-oscuro rounded-lg border border-marron/10">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-marron/20 rounded w-1/4"></div>
              <div className="h-5 bg-marron/20 rounded w-1/6"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-6 bg-marron/20 rounded w-1/3"></div>
              <div className="h-6 bg-marron/20 rounded w-1/5"></div>
            </div>
            <div className="h-12 bg-marron/20 rounded w-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSkeleton;

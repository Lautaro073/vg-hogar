import React from "react";

const Preload = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="text-center p-6 rounded-lg">
        <div className="mb-4">
          <div className="h-12 w-12 rounded-full border-4 border-marron/30 border-t-marron animate-spin mx-auto"></div>
        </div>
        <p className="text-marron font-medium text-lg">
          Cargando productos...
        </p>
      </div>
    </div>
  );
};

export default Preload;

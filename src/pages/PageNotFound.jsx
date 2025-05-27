import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-crema min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Número 404 grande */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-marron mb-4">404</h1>
            <div className="w-24 h-1 bg-marron mx-auto rounded-full"></div>
          </div>
          
          {/* Mensaje principal */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-marron mb-4">
              ¡Página no encontrada!
            </h2>
            <p className="text-marron/70 text-lg leading-relaxed">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-marron hover:bg-marron/80 text-crema font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Volver al Inicio
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-crema-oscuro hover:bg-crema-oscuro/80 text-marron font-medium py-3 px-6 rounded-lg border border-marron/20 transition-colors duration-200"
            >
              Volver Atrás
            </button>
          </div>
          
          {/* Enlaces adicionales */}
          <div className="mt-8 pt-6 border-t border-marron/10">
            <p className="text-marron/60 text-sm mb-3">
              ¿Necesitas ayuda? Visita:
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <button
                onClick={() => navigate('/productos')}
                className="text-marron hover:text-marron/80 underline transition-colors"
              >
                Productos
              </button>
              <span className="text-marron/30">•</span>
              <button
                onClick={() => navigate('/categorias')}
                className="text-marron hover:text-marron/80 underline transition-colors"
              >
                Categorías
              </button>
              <span className="text-marron/30">•</span>
              <button
                onClick={() => navigate('/contacto')}
                className="text-marron hover:text-marron/80 underline transition-colors"
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;

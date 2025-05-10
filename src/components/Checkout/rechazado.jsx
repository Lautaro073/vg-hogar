import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from "../ui/button";

const PagoRechazado = () => {
  return (
    <div className="bg-crema min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-crema-oscuro rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-500 py-6 px-4 flex flex-col items-center">
          <div className="bg-crema h-20 w-20 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-crema text-center">Pago Rechazado</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-marron text-lg">
              Lo sentimos, tu pago ha sido rechazado
            </p>
            <p className="text-marron/80">
              Ha ocurrido un problema al procesar tu pago. Por favor, verifica la información de tu tarjeta e intenta nuevamente.
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="font-medium text-red-700 mb-2">Posibles causas:</h3>
            <ul className="space-y-2 text-marron/80">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fondos insuficientes en la tarjeta</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Datos incorrectos de la tarjeta</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Problemas temporales con tu entidad bancaria</span>
              </li>
            </ul>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/carrito">
              <Button className="w-full bg-marron hover:bg-marron/80 text-crema">
                Volver al Carrito
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoRechazado;
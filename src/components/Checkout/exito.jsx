import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from "../ui/button";

const PagoExitoso = () => {
  return (
    <div className="bg-crema min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-crema-oscuro rounded-lg shadow-md overflow-hidden">
        <div className="bg-crema-oscuro py-6 px-4 flex flex-col items-center">
          <div className="bg-crema h-20 w-20 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="h-12 w-12 text-marron" />
          </div>
          <h2 className="text-2xl font-bold text-marron text-center">¡Pago Exitoso!</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-marron text-lg">
              ¡Tu compra se ha completado con éxito!
            </p>
            <p className="text-marron/80">
              Gracias por tu compra. Te contactaremos cuando tu pedido esté listo para ser entregado o retirado.
            </p>
          </div>
          
          <div className="bg-marron/5 border border-marron/10 rounded-md p-4">
            <h3 className="font-medium text-marron mb-2">¿Qué sigue?</h3>
            <ul className="space-y-2 text-marron/80">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Recibirás un correo electrónico de confirmación con los detalles de tu compra.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Prepararemos tu pedido y te avisaremos cuando esté listo.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>¡Disfruta tus productos de VG Hogar!</span>
              </li>
            </ul>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full bg-marron hover:bg-marron/80 text-crema">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default PagoExitoso;

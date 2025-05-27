import React from "react";
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from "../ui/button";

const PagoPendiente = () => {
  return (
    <div className="bg-crema min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-crema-oscuro rounded-lg shadow-md overflow-hidden">
        <div className="bg-amber-500 py-6 px-4 flex flex-col items-center">
          <div className="bg-crema h-20 w-20 rounded-full flex items-center justify-center mb-3">
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-crema text-center">Pago Pendiente</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-marron text-lg">
              Tu pago está siendo procesado
            </p>
            <p className="text-marron/80">
              Tu pago se encuentra actualmente pendiente de confirmación.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h3 className="font-medium text-amber-700 mb-2">Información importante:</h3>
            <p className="text-marron/80">
              En caso de que recibas la confirmación de aprobación de tu pago, te solicitamos que nos lo notifiques y nos envíes el correspondiente comprobante a través de WhatsApp haciendo clic en el botón de abajo.
            </p>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/+5492474415219?text=Hola,%20quiero%20confirmar%20mi%20pago%20pendiente" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-marron">
                Notificar por WhatsApp
              </Button>
            </a>
            
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

export default PagoPendiente;

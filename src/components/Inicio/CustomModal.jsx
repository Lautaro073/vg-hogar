import React, { useEffect } from "react";
import { useCarrito } from "../../Context/CarritoContext";

// Importaciones de shadcn/ui
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

const CustomModal = ({ isOpen, closeModal, product }) => {
  const { agregarAlCarrito, loadingMessage } = useCarrito();

  const handleAgregarAlCarrito = () => {
    if (product) {
      agregarAlCarrito(product, 1);
      //closeModal(); // Ahora cerramos el modal al agregar al carrito
    }
  };

  useEffect(() => {
    if (loadingMessage) {
      showAlert(loadingMessage, "loading");
    }
  }, [loadingMessage]);

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    
    // Clases de Tailwind para la alerta
    const baseClasses = "fixed bottom-5 right-5 py-3 px-4 rounded-md shadow-lg z-50 transform translate-y-12 opacity-0 transition-all duration-300";
    
    // Colores basados en el tipo de alerta
    let typeClasses = "";
    switch (type) {
      case "success":
        typeClasses = "bg-marron text-crema";
        break;
      case "error":
        typeClasses = "bg-red-500 text-crema";
        break;
      case "loading":
        typeClasses = "bg-blue-500 text-crema";
        break;
      default:
        typeClasses = "bg-marron text-crema";
    }
    
    alertDiv.className = `${baseClasses} ${typeClasses}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Mostrar la alerta con una pequeña animación
    setTimeout(() => {
      alertDiv.classList.replace("translate-y-12", "translate-y-0");
      alertDiv.classList.replace("opacity-0", "opacity-100");
    }, 10);

    // Ocultar la alerta después de un tiempo
    setTimeout(() => {
      alertDiv.classList.replace("translate-y-0", "translate-y-12");
      alertDiv.classList.replace("opacity-100", "opacity-0");
      
      setTimeout(() => {
        alertDiv.remove();
      }, 310);
    }, 3000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="!bg-crema-oscuro border-0 max-w-md w-full rounded-lg overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <div className="w-full aspect-square overflow-hidden mb-4">
            <img
              src={product ? product.imagen : ""}
              alt={product ? product.nombre : ""}
              className="w-full h-full object-cover"
            />
          </div>
          
          <DialogTitle className="text-xl font-bold text-marron">
            {product ? product.nombre : ""}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-4 py-4 space-y-2">
          <p className="font-medium text-marron">
            Precio: {product ? `$${product.precio}` : ""}
          </p>
          <p className="text-marron">
            {product ? product.descripcion : ""}
          </p>
        </div>
        
        <DialogFooter className="p-4">
          <Button
            className="w-full bg-marron hover:bg-marron/80 text-crema"
            onClick={handleAgregarAlCarrito}
          >
            Añadir al Carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;

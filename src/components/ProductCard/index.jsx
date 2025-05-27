import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

function ProductCard({ 
  producto, 
  onClick, 
  onAgregarCarrito, 
  className = "",
  showPrice = true,
  showDescription = true 
}) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(producto);
    }
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    if (onAgregarCarrito) {
      onAgregarCarrito(producto);
    }
  };

  return (
    <Card
      className={`h-full cursor-pointer overflow-hidden bg-crema-oscuro border-marron/10 hover:shadow-md transition-all ${className}`}
      onClick={handleCardClick}
    >      {/* Imagen con relación de aspecto ajustada */}
      <div className="relative pt-[60%] overflow-hidden">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-103"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
            e.target.onerror = null;
          }}
        />
        {/* Precio */}
        {showPrice && (
          <div className="absolute bottom-0 right-0 bg-marron/80 text-crema px-2 py-1 text-sm font-medium">
            ${producto.precio}
          </div>
        )}
      </div>      <CardHeader className="bg-crema-oscuro p-3 pb-1">
        <CardTitle className="text-marron text-base font-semibold line-clamp-1">
          {producto.nombre}
        </CardTitle>
      </CardHeader>

      {showDescription && (
        <CardContent className="bg-crema-oscuro p-3 py-2">
          <p className="text-marron/80 text-sm min-h-[2.5em] line-clamp-2">
            {producto.descripcion}
          </p>
        </CardContent>
      )}

      <CardFooter className="bg-crema-oscuro p-3 pt-1">
        <Button
          size="sm"
          className="w-full bg-marron hover:bg-marron/80 text-crema text-sm font-medium"
          onClick={handleAgregarCarrito}
        >
          Añadir
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;

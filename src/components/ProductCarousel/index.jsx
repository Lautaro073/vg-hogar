import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarrito } from "../../Context/CarritoContext";
import ProductCard from "../ProductCard";

function ProductCarousel({ productos, titulo, onProductClick }) {
  const { agregarAlCarrito } = useCarrito();
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [productos]);  const scrollToDirection = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 280; // Ancho aproximado de una tarjeta + gap (260px + 20px)
      const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };
  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    
    // Eliminar toda esta lógica de alerta
    // const alertDiv = document.createElement('div');
    // alertDiv.className = 'alert-custom alert-success';
    // alertDiv.textContent = 'Producto agregado al carrito';
    
    // document.body.appendChild(alertDiv);
    // setTimeout(() => alertDiv.classList.add('show'), 10);
    // setTimeout(() => {
    //   alertDiv.classList.remove('show');
    //   setTimeout(() => alertDiv.remove(), 310);
    // }, 3000);
  };

  if (!productos || productos.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      {/* Título de la sección */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-marron">{titulo}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToDirection('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0 border-marron/30 text-marron hover:bg-marron/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToDirection('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0 border-marron/30 text-marron hover:bg-marron/10 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carrusel de productos */}
      <div className="relative">        <div 
          ref={carouselRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >          {productos.map((producto) => (
            <div key={`carousel-producto-${producto.id_producto}`} className="flex-shrink-0 w-[260px]">
              <ProductCard
                producto={producto}
                onClick={onProductClick}
                onAgregarCarrito={handleAgregarAlCarrito}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Gradientes para indicar scroll */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-crema to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-crema to-transparent pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
}

export default ProductCarousel;
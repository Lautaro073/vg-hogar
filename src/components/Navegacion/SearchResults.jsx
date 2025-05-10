// SearchResults.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../../components/Inicio/CustomModal';
import { Button } from "../ui/button";
import { Loader2, Plus } from 'lucide-react';

function SearchResults({ productos, onClose, isSearching }) {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add('show'), 10);
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 310);
    }, 3000);
  }

  const handleAgregarAlCarrito = (e, producto) => {
    e.stopPropagation();
    agregarAlCarrito(producto);
    showAlert("Producto agregado al carrito", "success");
  };
  
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
    if (onClose) onClose();
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalIsOpen(false);
  };
    
  return (
    <>
      <div className="absolute top-full left-0 right-0 z-50 bg-crema shadow-lg p-4 rounded-b-md max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-marron mb-4">Resultados de la búsqueda</h3>
        
        {/* Estado de carga */}
        {isSearching && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-marron animate-spin" />
            <span className="ml-3 text-marron font-medium">Buscando productos...</span>
          </div>
        )}
        
        {/* Resultados encontrados */}
        {!isSearching && productos.length > 0 ? (
          <div className="divide-y divide-marron/10">
            {productos.map((producto) => (
              <div 
                key={`producto-${producto.id_producto}`}
                className="py-3 flex items-center gap-3 hover:bg-marron/5 transition-colors cursor-pointer"
                onClick={() => openModal(producto)}
              >
                {/* Imagen miniatura */}
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                
                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-marron truncate">{producto.nombre}</h4>
                  <p className="text-sm text-marron/70 line-clamp-1">{producto.descripcion}</p>
                  <p className="font-bold text-marron">${producto.precio}</p>
                </div>
                
                {/* Botón para agregar al carrito */}
                <Button 
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-marron hover:bg-marron/80 text-crema"
                  onClick={(e) => handleAgregarAlCarrito(e, producto)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : !isSearching ? (
          <p className="text-marron text-center py-4">No se encontraron productos</p>
        ) : null}
        
        {/* Botón para ver todos los resultados */}
        {!isSearching && productos.length > 0 && (
          <div className="flex justify-center mt-4 pt-3 border-t border-marron/10">
            <Button 
              className="bg-marron hover:bg-marron/80 text-crema"
              onClick={() => {
                navigate(`/buscar?search=${new URLSearchParams(window.location.search).get("search") || document.querySelector('input[type="text"]').value}`);
                if (onClose) onClose();
              }}
            >
              Ver todos los resultados
            </Button>
          </div>
        )}
      </div>
      
      <CustomModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        product={selectedProduct}
      />
    </>
  );
}
  
export default SearchResults;
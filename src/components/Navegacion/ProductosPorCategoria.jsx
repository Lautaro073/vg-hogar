import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../../components/Inicio/CustomModal';
import Preload from "../../components/Preload/index";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function ProductosPorCategoria() {
  const { agregarAlCarrito } = useCarrito();
  const params = useParams();
  const categoriaNombre = params.categoria;

  const [productos, setProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cargaCompleta, setCargaCompleta] = useState(false);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const response = await axios.get(`categorias/categoria/${categoriaNombre}`);
        setProductos(response.data);
        setCargaCompleta(true);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setCargaCompleta(true);
      }
    }

    obtenerProductos();
  }, [categoriaNombre]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalIsOpen(false);
  };

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add("show"), 10);
    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => alertDiv.remove(), 310);
    }, 3000);
  }
  
  const handleAgregarAlCarrito = (e, producto) => {
    e.stopPropagation();
    agregarAlCarrito(producto);
    showAlert("Producto agregado al carrito", "success");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-marron mb-6 text-center">
          {categoriaNombre} Disponibles:
        </h2>

        {cargaCompleta ? (
          productos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {productos.map((producto) => (
                <Card
                  key={`producto-${producto.id_producto}`}
                  className="h-full cursor-pointer overflow-hidden bg-crema-oscuro border-marron/10 hover:shadow-md transition-all"
                  onClick={() => openModal(producto)}
                >
                  {/* Imagen con relación de aspecto reducida */}
                  <div className="relative pt-[85%] overflow-hidden">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-103"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute bottom-0 right-0 bg-marron/80 text-crema px-3 py-1 text-sm font-medium">
                      ${producto.precio}
                    </div>
                  </div>

                  <CardHeader className="bg-crema-oscuro p-2 pb-0">
                    <CardTitle className="text-marron text-base line-clamp-1">
                      {producto.nombre}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="bg-crema-oscuro p-2 py-1">
                    <p className="text-marron/80 text-xs min-h-[2.5em] line-clamp-2">
                      {producto.descripcion}
                    </p>
                  </CardContent>

                  <CardFooter className="bg-crema-oscuro p-2 pt-0">
                    <Button
                      size="sm"
                      className="w-full bg-marron hover:bg-marron/80 text-crema text-xs"
                      onClick={(e) => handleAgregarAlCarrito(e, producto)}
                    >
                      Añadir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-marron text-lg">
              Por el momento no hay productos disponibles en la categoría {categoriaNombre}.
            </div>
          )
        ) : (
          <Preload />
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

export default ProductosPorCategoria;

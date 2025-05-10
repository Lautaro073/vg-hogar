import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from "./CustomModal";
import Preload from "../Preload/index";

// Importaciones de shadcn/ui
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

function Inicio() {
  const { agregarAlCarrito } = useCarrito();
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoriaNombre, setCategoriaNombre] = useState("Todos los productos");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = window.innerWidth <= 768 ? 10 : 15;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cargaCompleta, setCargaCompleta] = useState(false);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setProductos([]);
    setCargaCompleta(false);
  }, [id]);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const response = await axios.get(
          `productos?limit=${limit}&offset=${offset}`
        );

        // Filtrar productos duplicados por ID
        const productosFormateados = response.data;

        if (response.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        // Añadir productos evitando duplicados
        setProductos((prevProductos) => {
          // Crear un Set con los IDs actuales para verificación rápida
          const existingIds = new Set(prevProductos.map((p) => p.id_producto));

          // Filtrar solo productos nuevos que no existían antes
          const nuevosProductos = productosFormateados.filter(
            (producto) => !existingIds.has(producto.id_producto)
          );

          return [...prevProductos, ...nuevosProductos];
        });

        if (response.data[0]) {
          setCategoriaNombre(response.data[0].nombre_categoria);
        } else {
          setCategoriaNombre("Sin productos");
        }

        setCargaCompleta(true);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    }

    obtenerProductos();
  }, [id, offset]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalIsOpen(false);
  };

  const handleAgregarAlCarrito = (e, producto) => {
    e.stopPropagation();
    agregarAlCarrito(producto);
  };

  return (
    <>
      {cargaCompleta ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-marron mb-6 text-center">
            {categoriaNombre} Disponibles:
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {productos.map((producto) => (
              <Card
                key={`producto-${producto.id_producto}`}
                className="h-full cursor-pointer overflow-hidden bg-crema-oscuro border-marron/10 hover:shadow-md transition-all"
                onClick={() => openModal(producto)}
              >
                {/* Imagen con relación de aspecto reducida */}
                <div className="relative pt-[55%] overflow-hidden">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-103"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    }}
                  />
                  {/* Precio más grande */}
                  <div className="absolute bottom-0 right-0 bg-marron/80 text-crema px-3 py-1 text-lg font-medium">
                    ${producto.precio}
                  </div>
                </div>

                <CardHeader className="bg-crema-oscuro p-2 pb-0">
                  <CardTitle className="text-marron text-lg line-clamp-1">
                    {producto.nombre}
                  </CardTitle>
                </CardHeader>

                <CardContent className="bg-crema-oscuro p-2 py-1">
                  <p className="text-marron/80 text-base min-h-[2.5em] line-clamp-2">
                    {producto.descripcion}
                  </p>
                </CardContent>

                <CardFooter className="bg-crema-oscuro p-2 pt-0">
                  <Button
                    size="sm"
                    className="w-full bg-marron hover:bg-marron/80 text-crema text-base"
                    onClick={(e) => handleAgregarAlCarrito(e, producto)}
                  >
                    Añadir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                className="bg-marron hover:bg-marron/80 text-crema"
                onClick={() => setOffset((prevOffset) => prevOffset + limit)}
              >
                Mostrar más
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Preload />
      )}

      <CustomModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        product={selectedProduct}
      />
    </>
  );
}

export default Inicio;

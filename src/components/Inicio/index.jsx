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

        // Ya no necesitamos procesar los talles
        const productosFormateados = response.data;

        if (response.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setProductos((prevProductos) => [
          ...prevProductos,
          ...productosFormateados,
        ]);

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div key={producto.id_producto}>
                <Card
                  className="h-full cursor-pointer overflow-hidden bg-crema-oscuro border-marron/10 hover:shadow-lg transition-all duration-300"
                  onClick={() => openModal(producto)}
                >
                  {/* Imagen con relación de aspecto fijo */}
                  <div className="relative pt-[100%] overflow-hidden group">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      }}
                    />
                    {/* Overlay con precio */}
                    <div className="absolute bottom-0 right-0 bg-marron/80 text-crema px-3 py-1 text-lg font-semibold">
                      ${producto.precio}
                    </div>
                  </div>

                  <CardHeader className="bg-crema-oscuro py-3">
                    <CardTitle className="text-marron text-lg">
                      {producto.nombre}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="bg-crema-oscuro py-3">
                    <p className="text-marron min-h-[60px] line-clamp-3">
                      {producto.descripcion}
                    </p>
                  </CardContent>

                  <CardFooter className="bg-crema-oscuro py-3">
                    <Button
                      className="w-full bg-marron hover:bg-marron/80 text-crema"
                      onClick={(e) => handleAgregarAlCarrito(e, producto)}
                    >
                      Añadir al Carrito
                    </Button>
                  </CardFooter>
                </Card>
              </div>
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

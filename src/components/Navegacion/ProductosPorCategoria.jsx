import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../../components/Inicio/CustomModal';
import { ProductGridSkeleton } from "../Skeleton";
import ProductCard from "../ProductCard";

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

    const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);

  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-marron mb-6 text-center">
          {categoriaNombre} Disponibles:
        </h2>        {cargaCompleta ? (
          productos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {productos.map((producto) => (
                <ProductCard
                  key={`producto-${producto.id_producto}`}
                  producto={producto}
                  onClick={openModal}
                  onAgregarCarrito={handleAgregarAlCarrito}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-marron text-lg">
              Por el momento no hay productos disponibles en la categoría {categoriaNombre}.
            </div>
          )        ) : (
          <ProductGridSkeleton showTitle={true} />
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

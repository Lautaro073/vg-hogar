import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../../components/Inicio/CustomModal';
import { ProductGridSkeleton } from "../Skeleton";
import ProductCard from "../ProductCard";

function SearchPage() {
  const { agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cargaCompleta, setCargaCompleta] = useState(false);
  const searchQuery = new URLSearchParams(window.location.search).get("search");

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

  useEffect(() => {
    setCargaCompleta(false);
    axios
      .get(`productos/search?search=${searchQuery}`)
      .then((response) => {
        setProductos(response.data);
        setCargaCompleta(true);
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
        setCargaCompleta(true);
      });
  }, [searchQuery]);

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
          Resultados para "{searchQuery}":
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
            <p className="text-center text-marron text-lg">
              No se encontraron productos con el nombre "{searchQuery}".
            </p>
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

export default SearchPage;

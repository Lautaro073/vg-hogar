import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../Context/CarritoContext";
import Preload from "../../components/Preload/index";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import PaymentSelector from "./PaymentSelector";
import "../../config";

function Carrito() {
  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 10);

    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => {
        alertDiv.remove();
      }, 310);
    }, 3000);
  }
  
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId");
  const carritoId = sessionId;
  const { actualizarCarrito } = useCarrito();
  const [cargaCompleta, setCargaCompleta] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);

  const cargarProductos = useCallback(() => {
    axios.get(`carrito/${carritoId}`).then((respuesta) => {
      console.log("Productos desde el servidor:", respuesta.data);
      setProductos(respuesta.data);
      setCargaCompleta(true);
    });
  }, [carritoId]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const agregarProducto = async (productoId) => {
    try {
      const stockActual = await verificarStock(productoId);
      const producto = productos.find((p) => p.id_producto === productoId);

      if (producto) {
        if (producto.cantidad + 1 > stockActual) {
          showAlert(
            "No hay suficiente stock disponible para agregar más productos.",
            "error"
          );
          return;
        }
      } else {
        if (1 > stockActual) {
          showAlert(
            "No hay suficiente stock disponible para agregar más productos.",
            "error"
          );
          return;
        }
      }

      const response = await axios.post(`carrito/${carritoId}`, {
        id_producto: productoId,
        cantidad: 1
      });
      
      await actualizarCarrito();
      if (response.status === 201 || response.status === 200) {
        cargarProductos();
        showAlert("Producto agregado", "success");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const quitarProducto = async (productoId) => {
    try {
      const producto = productos.find((p) => p.id_producto === productoId);
      
      if (!producto) {
        console.error("Producto no encontrado:", productoId);
        return;
      }
  
      let response;
      if (producto.cantidad > 1) {
        // Si hay más de una unidad, reducimos la cantidad
        response = await axios.put(
          `carrito/${carritoId}/${productoId}`,
          {
            cantidad: producto.cantidad - 1,
          }
        );
      } else {
        // Si hay solo una unidad, eliminamos el producto
        response = await axios.delete(
          `carrito/${carritoId}/${productoId}`
        );
      }
      
      await actualizarCarrito();
      if (response.status === 200) {
        cargarProductos();
        showAlert("Producto eliminado", "error");
      }
    } catch (error) {
      console.error("Error al quitar producto:", error);
    }
  };
  
  const verificarStock = async (productoId) => {
    if (!productoId) {
      console.error("Producto ID no definido");
      return 0;
    }
    const response = await axios.get(`productos/${productoId}/stock`);
    return response.data.stock;
  };

  const calcularTotal = () => {
    return productos.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
  };

  const [paymentUrl, setPaymentUrl] = useState("");

  const handleSelectPayment = () => {
    setShowPaymentSelector(true);
  };

  const handleMercadoPagoSelected = async () => {
    try {
      const productDetails = productos
        .map(producto => producto.nombre)
        .join(", ");
        
      const total = calcularTotal();
      
      const response = await axios.post("create_preference", {
        title: `Compra de: ${productDetails}`,
        quantity: 1,
        price: total,
      });

      setPaymentUrl(response.data);
      setShowPaymentSelector(false);
    } catch (error) {
      console.log("Error al crear la preferencia", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("status");
  
    if (paymentStatus) {
      if (paymentStatus === null) {
        navigate("/carrito");
      } 
    }
  }, [navigate]);
  
  return (
    <div className="bg-crema min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-marron mb-6">Productos en el Carrito</h2>

        {!cargaCompleta ? (
          <Preload />
        ) : productos.length === 0 ? (
          <div className="bg-crema-oscuro p-4 rounded-md text-marron">
            No hay productos en el carrito.
          </div>
        ) : (
          <div className="bg-crema-oscuro rounded-md overflow-hidden shadow">
            {productos.map((producto, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row justify-between items-center p-4 ${
                  index < productos.length - 1 ? "border-b border-marron/10" : ""
                }`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="text-marron font-medium">{producto.nombre}</h3>
                    <p className="text-marron/70 text-sm">${producto.precio} / unidad</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 rounded-full p-0 border border-marron/30 text-marron"
                    onClick={() => quitarProducto(producto.id_producto)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="mx-3 text-marron font-medium">
                    {producto.cantidad}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 rounded-full p-0 border border-marron/30 text-marron"
                    onClick={() => agregarProducto(producto.id_producto)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <div className="ml-6 bg-marron text-crema px-3 py-1 rounded-full text-sm font-medium">
                    ${(producto.precio * producto.cantidad).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-crema-oscuro/80 border-t border-marron/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-marron font-medium">Total:</span>
                <span className="text-marron font-bold text-xl">${calcularTotal().toFixed(2)}</span>
              </div>
              
              {paymentUrl ? (
                <a
                  href={paymentUrl}
                  rel="noopener noreferrer"
                  className="block w-full bg-marron hover:bg-marron/80 text-crema py-2 px-4 rounded text-center transition-colors"
                >
                  Pagar con Mercado Pago
                </a>
              ) : (
                <Button 
                  className="w-full bg-marron hover:bg-marron/80 text-crema" 
                  onClick={handleSelectPayment}
                >
                  Proceder al Pago
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={showPaymentSelector} onOpenChange={setShowPaymentSelector}>
        <PaymentSelector 
          onClose={() => setShowPaymentSelector(false)}
          onSelectMercadoPago={handleMercadoPagoSelected}
          productos={productos}
          totalAmount={calcularTotal()}
        />
      </Dialog>
    </div>
  );
}

export default Carrito;

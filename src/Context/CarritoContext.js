import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

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

export const CarritoProvider = ({ children }) => {
  // Genera un ID de sesión si no existe
  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = "user_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [userId, setUserId] = useState(getOrCreateSessionId());
  const [loadingMessage, setLoadingMessage] = useState("");

  const actualizarCarrito = async () => {
    if (userId) {
      try {
        const response = await axios.get(`carrito/${userId}`);
        const productos = response.data;
        let total = productos.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );
        setCantidadProductos(productos.length);
        setTotalCarrito(total);
      } catch (error) {
        console.error("Error al obtener el carrito", error);
      }
    }
  };

  const agregarAlCarrito = async (producto, cantidad = 1) => {
    // Asegurar que tenemos un ID de usuario
    const currentUserId = getOrCreateSessionId();
    if (currentUserId !== userId) {
      setUserId(currentUserId);
    }
    
    // Extraer solo el id_producto
    const { id_producto } = producto;

    // Verificar que tenemos un ID de producto
    if (!id_producto) {
      showAlert("Error: Producto no válido", "error");
      return;
    }

    try {
      setLoadingMessage("Añadiendo producto, espere por favor...");

      // Ya no enviamos el campo 'talle'
      await axios.post(`carrito/${currentUserId}`, {
        id_producto,
        cantidad
      });

      await actualizarCarrito();

      // Agregar un pequeño retraso antes de mostrar el mensaje de éxito
      setTimeout(() => {
        showAlert("Producto agregado al carrito!", "success");
      }, 500);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      showAlert("Error al agregar el producto al carrito", "error");
    } finally {
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    actualizarCarrito();
  }, [userId]);

  return (
    <CarritoContext.Provider
      value={{
        cantidadProductos,
        totalCarrito,
        actualizarCarrito,
        agregarAlCarrito,
        loadingMessage,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

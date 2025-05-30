import Inicio from "./components/Inicio";
import Producto from "./components/Producto";
import Carrito from "./components/Carrito";
import Checkout from "./components/Checkout";
import Checkouterror from "./components/Checkout/rechazado";
import Checkoutpendiente from "./components/Checkout/pendiente";
import Checkoutexito from "./components/Checkout/exito";
import Navegacion from "./components/Navegacion";
import ListaProductos from "./components/ListaProductos";
import Login from "./pages/Login";
import CargarProductos from "./pages/cargarProductos";
import SearchPage from "./components/Navegacion/SearchPage";
import ProductosPorCategoria from "./components/Navegacion/ProductosPorCategoria";
import PageNotFound from './pages/PageNotFound'
//import ProductosPorCategoria from './components/ProductoPorCategoria';
import Footer from "./components/Footer/inicio"
import { BrowserRouter  as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { CarritoProvider } from "./Context/CarritoContext";
import axios from "axios";
import PrivateRoute from './PrivateRoute'; 
import './css/alerta.css'
import 'font-awesome/css/font-awesome.min.css';
import PagoExitoso from "./components/Checkout/exito";
import PagoPendiente from "./components/Checkout/pendiente";
import PagoRechazado from "./components/Checkout/rechazado";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";

function App() {
  useEffect(() => {
    let currentSessionId = localStorage.getItem("sessionId");
    console.log("Sesión ID actual:", currentSessionId);

    // Si no hay un sessionId en el almacenamiento local, solicitamos uno nuevo.
    if (!currentSessionId) {
      axios
        .get("session/start-session")
        .then((response) => {
          const newSessionId = response.data.sessionId;

          if (newSessionId) {
            // Almacenamos el sessionId en el almacenamiento local
            localStorage.setItem("sessionId", newSessionId);
            
            // Enviamos el sessionId a la base de datos.
            axios
              .post("session/guardar", {
                id_carrito: newSessionId,
              })
              .then(() => {
                console.log(
                  "ID del carrito guardado en la base de datos:",
                  newSessionId
                );
              })
              .catch((error) => {
                console.error(
                  "Error al guardar el ID del carrito en la base de datos:",
                  error
                );
              });
          }
        });
    }
}, []);

  return (
    <>
      <CarritoProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navegacion />
              <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Inicio  />} />
                <Route path="/producto/:id" element={<Producto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/error" element={<Checkouterror />} />
                <Route path="/checkout/pendiente" element={<Checkoutpendiente />} />
                <Route path="/checkout/exito" element={<Checkoutexito />} />
                <Route path="/productos" element={<ListaProductos />} />
                <Route path="/categoria/:categoria" element={<ProductosPorCategoria />} />
                <Route path="/buscar" element={<SearchPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login" element={<PrivateRoute />}>
                  <Route path="cargarProductos" element={<CargarProductos />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
                <Route path="/exitoso" element={<PagoExitoso />} />
                <Route path="/pendiente" element={<PagoPendiente />} />
                <Route path="/rechazado" element={<PagoRechazado />} />
                <Route path="/nosotros"  element={<Nosotros />}/>
                <Route path="/contacto" element={<Contacto />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CarritoProvider>
    </>
  );
}


export default App;

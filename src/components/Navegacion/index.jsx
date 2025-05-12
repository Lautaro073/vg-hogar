import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, ChevronDown } from "lucide-react";
import axios from "axios";
import logo from "../../assets/logo.png";
import { useCarrito } from "../../Context/CarritoContext";
import SearchResults from "./SearchResults";

// Importaciones de shadcn/ui
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

function NavbarPrincipal() {
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { cantidadProductos, totalCarrito, actualizarCarrito } = useCarrito();

  useEffect(() => {
    actualizarCarrito();
  }, [actualizarCarrito]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (search.trim() === "") return;
    
    navigate(`/buscar?search=${encodeURIComponent(search)}`);
    setShowResults(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Solo realizar búsqueda si hay al menos 3 caracteres
    if (value.length >= 3) {
      setIsSearching(true);
      setShowResults(true);
      
      axios
        .get(`productos/search?search=${encodeURIComponent(value)}&limit=4`)
        .then((response) => {
          setProductos(response.data);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error("Error en la búsqueda:", error);
          setIsSearching(false);
        });
    } else {
      setShowResults(false);
    }
  };

  return (
    <header className="bg-crema-oscuro text-marron py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <Link to="/" className="block">
              <img src={logo} className="h-24 w-auto" alt="VG Hogar" />
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="w-full md:flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex w-full">
              <Input
                className="w-full !bg-crema !text-marron !placeholder:text-marron/60 rounded-r-none border-marron/20 border-r-0 
                focus:!ring-marron/30 focus:!border-marron/30 focus:!bg-crema focus-visible:!ring-marron/30 focus-visible:!border-marron/30 focus-visible:!bg-crema"
                type="text"
                placeholder="Busca tu Producto..."
                value={search}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                className="rounded-l-none bg-marron hover:bg-marron/80 text-crema"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            {(showResults && productos.length > 0) || isSearching ? (
              <SearchResults 
                productos={productos} 
                onClose={() => setShowResults(false)} 
                isSearching={isSearching}
              />
            ) : null}
          </div>

          {/* Carrito Desktop */}
          <div className="w-full md:w-auto flex justify-center md:justify-end hidden md:flex">
            <Link
              to="/carrito"
              className="flex items-center gap-3 text-marron hover:text-marron/80 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="h-6 w-6" />
                {cantidadProductos > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-marron text-crema text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                    {cantidadProductos}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{cantidadProductos} Productos</span>
                <span className="font-bold">${totalCarrito}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Botón flotante de carrito para móvil */}
      <Link
        to="/carrito"
        className="fixed bottom-5 right-5 w-[60px] h-[60px] bg-marron rounded-full flex items-center justify-center shadow-lg z-50 md:hidden"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6 text-crema" />
          {cantidadProductos > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-crema text-marron text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {cantidadProductos}
            </Badge>
          )}
        </div>
      </Link>
    </header>
  );
}

function NavbarCategorias({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const categoriasListRef = useRef(null);
  
  useEffect(() => {
    async function obtenerCategorias() {
      try {
        const response = await axios.get("categorias");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    }

    obtenerCategorias();
  }, []);

  // Calcular si hay suficiente espacio para todas las categorías
  useEffect(() => {
    if (categorias.length > 0) {
      const checkWidth = () => {
        // Comprobar que todas las referencias existen antes de hacer cálculos
        if (!containerRef.current || !categoriasListRef.current) {
          // Si alguna referencia no existe, programar otro intento
          setTimeout(checkWidth, 100);
          return;
        }

        try {
          const containerWidth = containerRef.current.clientWidth;
          const inicioWidth = 80; // Aprox ancho del link Inicio
          const moreButtonWidth = 80; // Aprox ancho del botón Más
          const categoriesWidth = categoriasListRef.current.scrollWidth;
          const availableWidth = containerWidth - inicioWidth - 20; // 20px de margen
          
          // Si no hay suficiente espacio para todas las categorías
          if (categoriesWidth > availableWidth) {
            setShowAllCategories(false);
          } else {
            setShowAllCategories(true);
          }
        } catch (error) {
          console.error("Error al calcular anchos:", error);
        }
      };
      
      // Esperar a que se rendericen las referencias
      const timer = setTimeout(checkWidth, 150);
      
      // Recalcular cuando cambie el tamaño de la ventana
      window.addEventListener('resize', checkWidth);
      return () => {
        window.removeEventListener('resize', checkWidth);
        clearTimeout(timer);
      };
    }
  }, [categorias]);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu && !event.target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  return (
    <>
      <div className="bg-crema-oscuro py-1 sticky top-0 z-40">
        <div className="container mx-auto px-4" ref={containerRef}>
          <div className="flex items-center justify-between" ref={navRef}>
            <div className="flex items-center">
              {/* Inicio siempre visible */}
              <Link
                to="/"
                className="px-4 py-2 font-medium text-marron hover:text-marron/70 transition-colors flex-shrink-0"
              >
                Inicio
              </Link>
              
              {/* Mostrar todas las categorías si hay espacio */}
              {showAllCategories && (
                <div 
                  className="flex items-center overflow-hidden" 
                  ref={categoriasListRef}
                >
                  {categorias.map((categoria) => (
                    <Link
                      key={categoria.id_categoria}
                      to={`/categoria/${categoria.nombre_categoria.toLowerCase()}`}
                      className="px-4 py-2 text-marron hover:text-marron/70 transition-colors whitespace-nowrap"
                    >
                      {categoria.nombre_categoria}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botón "Más" solo si no hay espacio para todas las categorías */}
            {!showAllCategories && (
              <div className="flex items-center more-menu-container">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="px-4 py-2 text-marron hover:text-marron/70 transition-colors flex items-center gap-1 bg-crema-oscuro"
                >
                  Más <ChevronDown className={`h-4 w-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menú desplegable con todas las categorías */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-14 bg-black/30">
          <div className="w-full max-w-md bg-crema rounded-md shadow-lg overflow-hidden mx-4">
            <div className="p-4 border-b border-marron/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-marron">Todas las categorías</h3>
                <button 
                  onClick={() => setShowMoreMenu(false)}
                  className="text-marron/70 hover:text-marron text-xl font-medium"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="py-2 max-h-[70vh] overflow-y-auto">
              <Link
                to="/"
                className="block px-4 py-3 text-marron hover:text-marron hover:bg-marron/10 border-b border-marron/10"
                onClick={() => setShowMoreMenu(false)}
              >
                Inicio
              </Link>
              {categorias.map((categoria) => (
                <Link
                  key={categoria.id_categoria}
                  to={`/categoria/${categoria.nombre_categoria.toLowerCase()}`}
                  className="block px-4 py-3 text-marron hover:text-marron hover:bg-marron/10 border-b border-marron/10"
                  onClick={() => setShowMoreMenu(false)}
                >
                  {categoria.nombre_categoria}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}

export default function Navegacion() {
  return (
    <>
      <NavbarPrincipal />
      <NavbarCategorias />
    </>
  );
}

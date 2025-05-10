import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, ChevronDown } from "lucide-react";
import axios from "axios";
import logo from "../../assets/logo.png";
import { useCarrito } from "../../Context/CarritoContext";
import SearchResults from "./SearchResults";

// Importaciones de shadcn/ui
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Badge } from "../ui/badge";

function NavbarPrincipal() {
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { cantidadProductos, totalCarrito, actualizarCarrito } = useCarrito();

  useEffect(() => {
    actualizarCarrito();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/buscar?search=${search}`);

    axios
      .get(`productos/search?search=${search}`)
      .then((response) => {
        setProductos(response.data);
        setShowResults(true);
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
      });
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
          <div className="w-full md:flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative flex w-full">
              <Input
                className="w-full !bg-crema !text-marron !placeholder:text-marron/60 rounded-r-none border-marron/20 border-r-0 
                focus:!ring-marron/30 focus:!border-marron/30 focus:!bg-crema focus-visible:!ring-marron/30 focus-visible:!border-marron/30 focus-visible:!bg-crema"
                type="text"
                placeholder="Busca tu Producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                type="submit"
                className="rounded-l-none bg-marron hover:bg-marron/80 text-crema"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
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
      {showResults && <SearchResults productos={productos} />}

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
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* Versión desktop - Categorías en línea */}
      <div className="bg-crema-oscuro text-marron hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto whitespace-nowrap py-2">
            <Link
              to="/"
              className="px-4 py-2 font-medium text-marron hover:text-marron/70 transition-colors"
            >
              Inicio
            </Link>

            {categorias.map((categoria) => (
              <Link
                key={categoria.id_categoria}
                to={`/categoria/${categoria.nombre_categoria.toLowerCase()}`}
                className="px-4 py-2 text-marron hover:text-marron/70 transition-colors"
              >
                {categoria.nombre_categoria}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Versión mobile */}
      <div className="bg-marron text-crema md:hidden">
        <div className="container mx-auto px-4 py-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent border-crema/30 text-crema hover:bg-marron/80"
              >
                Categorías
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-crema-oscuro border-0">
              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  to="/"
                  className="text-marron hover:text-marron/70 py-2 border-b border-marron/10"
                  onClick={() => setIsOpen(false)}
                >
                  Inicio
                </Link>
                {categorias.map((categoria) => (
                  <Link
                    key={categoria.id_categoria}
                    to={`/categoria/${categoria.nombre_categoria.toLowerCase()}`}
                    className="text-marron hover:text-marron/70 py-2 border-b border-marron/10"
                    onClick={() => setIsOpen(false)}
                  >
                    {categoria.nombre_categoria}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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

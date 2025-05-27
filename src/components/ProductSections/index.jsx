import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCarousel from "../ProductCarousel";

function ProductSections({ onProductClick }) {
  const [secciones, setSecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    obtenerSecciones();
  }, []);

  const obtenerSecciones = async () => {
    try {
      setIsLoading(true);
      
      const seccionesData = [];

      // Primero obtenemos todos los productos para extraer los tags únicos
      try {
        const allProductsResponse = await axios.get("productos/all");
        const allProducts = allProductsResponse.data;
        
        // Extraer tags únicos (excluyendo null, undefined y strings vacíos)
        const tagsUnicos = [...new Set(
          allProducts
            .map(producto => producto.tag)
            .filter(tag => tag && tag.trim() !== "")
        )];

        console.log("Tags únicos encontrados:", tagsUnicos);

        // Obtener productos para cada tag único
        for (const tag of tagsUnicos) {
          try {
            const response = await axios.get(`productos/tag/${tag}`);
            if (response.data && response.data.length > 0) {
              // Crear título sin emojis, solo capitalizar primera letra
              const titulo = tag.charAt(0).toUpperCase() + tag.slice(1);
              
              console.log(`Productos para tag "${tag}":`, response.data.length);
              
              seccionesData.push({
                id: tag,
                titulo: titulo,
                productos: response.data
              });
            }
          } catch (error) {
            console.log(`Error al obtener productos para tag "${tag}":`, error);
          }
        }
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }

      // Obtener categorías con sus productos usando el endpoint actualizado
      try {
        const categoriasResponse = await axios.get("categorias/con-productos");
        const categorias = categoriasResponse.data;
        console.log("Categorías con productos obtenidas:", categorias);

        // Filtrar solo las categorías que tienen productos
        const categoriasConProductos = categorias.filter(categoria => 
          categoria.productos && categoria.productos.length > 0
        );

        console.log("Categorías con productos filtradas:", categoriasConProductos.length);

        for (const categoria of categoriasConProductos) {
          console.log(`Agregando categoría: ${categoria.nombre_categoria} con ${categoria.productos.length} productos`);
          
          seccionesData.push({
            id: `categoria-${categoria.id_categoria}`,
            titulo: categoria.nombre_categoria,
            productos: categoria.productos.slice(0, 8) // Limitamos a 8 productos por sección
          });
        }
      } catch (error) {
        console.error("Error al obtener categorías con productos:", error);
      }

      console.log("Secciones finales:", seccionesData.length);
      setSecciones(seccionesData);
    } catch (error) {
      console.error("Error al obtener secciones de productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="h-8 bg-marron/20 rounded w-1/3 mb-4"></div>
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="flex-shrink-0 w-[300px]">
                      <div className="h-[200px] bg-marron/10 rounded-t-lg"></div>
                      <div className="p-3 space-y-2 bg-crema-oscuro rounded-b-lg">
                        <div className="h-4 bg-marron/20 rounded"></div>
                        <div className="h-3 bg-marron/10 rounded w-2/3"></div>
                        <div className="h-8 bg-marron/20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {secciones.length > 0 ? (
          <div className="space-y-10">
            {secciones.map((seccion) => (
              <ProductCarousel
                key={seccion.id}
                productos={seccion.productos}
                titulo={seccion.titulo}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-marron/70 text-lg">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSections;
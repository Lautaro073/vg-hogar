import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Trash2, Edit, Plus, Save, Tag, Package, FileImage, Loader2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";

function AdminPanel() {
  // Estados para productos
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [idCategoria, setIdCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [stock, setStock] = useState(0);
  const [tag, setTag] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [filtroProducto, setFiltroProducto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para categorías
  const [categorias, setCategorias] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false);
  const [isLoadingCategoria, setIsLoadingCategoria] = useState(false);
  
  // Alertas
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
  
  // Cargar categorías y productos al iniciar
  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);
  
  // Funciones para Categorías
  const cargarCategorias = async () => {
    try {
      const response = await axios.get("categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      showAlert("Error al cargar las categorías", "error");
    }
  };
  
  const agregarCategoria = async (e) => {
    e.preventDefault();
    if (!nombreCategoria.trim()) {
      showAlert("Por favor, ingrese un nombre de categoría", "error");
      return;
    }
    
    setIsLoadingCategoria(true);
    try {
      await axios.post("categorias/", { nombre_categoria: nombreCategoria });
      showAlert("Categoría agregada correctamente", "success");
      setNombreCategoria("");
      cargarCategorias();
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      showAlert("Error al agregar la categoría", "error");
    } finally {
      setIsLoadingCategoria(false);
    }
  };
  
  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setNombreCategoria(categoria.nombre_categoria);
    setModoEdicionCategoria(true);
  };
  
  const actualizarCategoria = async (e) => {
    e.preventDefault();
    if (!nombreCategoria.trim() || !categoriaSeleccionada) {
      showAlert("Por favor, seleccione una categoría y escriba un nombre", "error");
      return;
    }
    
    setIsLoadingCategoria(true);
    try {
      await axios.put(`categorias/${categoriaSeleccionada.id_categoria}`, {
        nombre_categoria: nombreCategoria,
      });
      showAlert("Categoría actualizada correctamente", "success");
      setNombreCategoria("");
      setCategoriaSeleccionada(null);
      setModoEdicionCategoria(false);
      cargarCategorias();
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      showAlert("Error al actualizar la categoría", "error");
    } finally {
      setIsLoadingCategoria(false);
    }
  };
  
  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`categorias/${id}`);
      showAlert("Categoría eliminada correctamente", "success");
      setCategoriaSeleccionada(null);
      setNombreCategoria("");
      setModoEdicionCategoria(false);
      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      showAlert("Error al eliminar la categoría", "error");
    }
  };
  
  const cancelarEdicionCategoria = () => {
    setNombreCategoria("");
    setCategoriaSeleccionada(null);
    setModoEdicionCategoria(false);
  };
  
  // Funciones para Productos
  const cargarProductos = async () => {
    try {
      const response = await axios.get("productos/all");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      showAlert("Error al cargar los productos", "error");
    }
  };
  
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setNombreProducto(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setIdCategoria(producto.id_categoria.toString());
    setStock(producto.stock);
    setImagenUrl(producto.imagen);
    setTag(producto.tag || "");
    setModoEdicion(true);
    setImagenPreview(null);
  };
  
  const resetearFormularioProducto = () => {
    setProductoSeleccionado(null);
    setNombreProducto("");
    setDescripcion("");
    setPrecio(0);
    setIdCategoria("");
    setStock(0);
    setImagenUrl("");
    setImagen(null);
    setImagenPreview(null);
    setTag("");
    setModoEdicion(false);
  };
  
  const agregarProducto = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("nombre", nombreProducto);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("id_categoria", idCategoria);
    formData.append("stock", stock);
    formData.append("tag", tag);
    
    if (imagen) {
      formData.append("imagen", imagen);
    }
    
    setIsLoading(true);
    try {
      await axios.post("productos", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showAlert("Producto agregado correctamente", "success");
      resetearFormularioProducto();
      cargarProductos();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      showAlert("Error al agregar el producto", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const actualizarProducto = async (e) => {
    e.preventDefault();
    
    if (!productoSeleccionado) {
      showAlert("Por favor, seleccione un producto para actualizar", "error");
      return;
    }
    
    const formData = new FormData();
    formData.append("nombre", nombreProducto);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("id_categoria", idCategoria);
    formData.append("stock", stock);
    formData.append("tag", tag);
    
    if (imagen) {
      formData.append("imagen", imagen);
    }
    
    setIsLoading(true);
    try {
      await axios.put(`productos/${productoSeleccionado.id_producto}`, formData);
      showAlert("Producto actualizado correctamente", "success");
      resetearFormularioProducto();
      cargarProductos();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      showAlert("Error al actualizar el producto", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`productos/${id}`);
      showAlert("Producto eliminado correctamente", "success");
      resetearFormularioProducto();
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      showAlert("Error al eliminar el producto", "error");
    }
  };
  
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Filtrar productos
  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
  );
  
  return (
    <div className="bg-crema min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold !text-marron mb-6">Panel de Administración</h1>
        
        <Tabs defaultValue="productos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 !bg-crema-oscuro rounded-lg border border-marron/10">
            <TabsTrigger 
              value="productos" 
              className="!text-marron data-[state=active]:!bg-marron/10 data-[state=inactive]:bg-transparent"
            >
              <Package className="mr-2 h-5 w-5" />
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="categorias" 
              className="!text-marron data-[state=active]:!bg-marron/10 data-[state=inactive]:bg-transparent"
            >
              <Tag className="mr-2 h-5 w-5" />
              Categorías
            </TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Productos */}
          <TabsContent value="productos">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de productos */}
              <div className="lg:col-span-1">
                <Card className="!bg-crema-oscuro border-marron/10 shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl text-marron">
                      {modoEdicion ? "Actualizar Producto" : "Agregar Producto"}
                    </CardTitle>
                    <CardDescription className="!text-marron/70">
                      Complete el formulario para {modoEdicion ? "actualizar el" : "agregar un"} producto
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombreProducto" className="!text-marron">Nombre del Producto</Label>
                        <Input
                          id="nombreProducto"
                          placeholder="Ingrese nombre del producto"
                          value={nombreProducto}
                          onChange={(e) => setNombreProducto(e.target.value)}
                          className="!bg-crema border-marron/30 !text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-marron">Descripción</Label>
                        <Textarea
                          id="descripcion"
                          placeholder="Ingrese descripción del producto"
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50 min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="precio" className="text-marron">Precio</Label>
                          <Input
                            id="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="stock" className="!text-marron">Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="!bg-crema border-marron/30 !text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="categoria" className="!text-marron">Categoría</Label>
                        <Select value={idCategoria} onValueChange={setIdCategoria}>
                          <SelectTrigger className="!bg-crema border-marron/30 !text-marron focus:!ring-marron/30">
                            <SelectValue placeholder="Seleccione una categoría" />
                          </SelectTrigger>
                          <SelectContent className="!bg-crema !border-marron/30 !text-marron">
                            {categorias.map((categoria) => (
                              <SelectItem 
                                key={categoria.id_categoria} 
                                value={categoria.id_categoria.toString()}
                                className="cursor-pointer !text-marron  hover:!bg-marron/10"
                              >
                                {categoria.nombre_categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tag" className="text-marron">Etiqueta (Tag)</Label>
                        <Input
                          id="tag"
                          placeholder="Ej: nuevo, oferta, destacado"
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                        />
                        <p className="text-xs text-marron/60">Este campo es opcional</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="imagen" className="text-marron">Imagen del Producto</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="!bg-crema !border-marron/10 !text-marron hover:!bg-marron/10 w-full"
                            onClick={() => document.getElementById('imagen').click()}
                          >
                            <FileImage className="mr-2 h-4 w-4" />
                            {imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                          </Button>
                          <Input
                            id="imagen"
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className="hidden"
                          />
                        </div>
                        
                        {/* Vista previa de imagen */}
                        {(imagenPreview || imagenUrl) && (
                          <div className="mt-4 relative">
                            <img 
                              src={imagenPreview || imagenUrl} 
                              alt="Vista previa" 
                              className="w-full h-40 object-cover rounded-md border border-marron/20" 
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 !bg-crema/80 !text-marron hover:!bg-crema"
                              onClick={() => {
                                setImagen(null);
                                setImagenPreview(null);
                                if (modoEdicion) {
                                  setImagenUrl("");
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-marron/10 pt-4">
                    {modoEdicion ? (
                      <>
                        <Button 
                          className="w-full !bg-crema hover:!bg-marron/5 !text-marron"
                          onClick={actualizarProducto}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Actualizando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar Cambios
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full !bg-crema !border-marron/5 !text-marron hover:!bg-marron/5"
                          onClick={resetearFormularioProducto}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full !bg-crema hover:!bg-marron/10 !text-marron"
                        onClick={agregarProducto}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Agregando...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Producto
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              {/* Lista de productos */}
              <div className="lg:col-span-2">
                <Card className="!bg-crema-oscuro border-marron/10 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-xl text-marron">
                        Productos ({productos.length})
                      </CardTitle>
                      <div className="relative w-full sm:w-64">
                        <Input
                          placeholder="Buscar productos..."
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50 pr-9"
                          value={filtroProducto}
                          onChange={(e) => setFiltroProducto(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Search className="h-4 w-4 text-marron/60" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="!text-marron w-[200px]">Nombre</TableHead>
                            <TableHead className="!text-marron text-center">Precio</TableHead>
                            <TableHead className="!text-marron text-center">Stock</TableHead>
                            <TableHead className="!text-marron">Categoría</TableHead>
                            <TableHead className="!text-marron">Tag</TableHead>
                            <TableHead className="!text-marron text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                              <TableRow key={producto.id_producto}>
                                <TableCell className="font-medium text-marron">
                                  <div className="flex items-center gap-2">
                                    {producto.imagen && (
                                      <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="w-8 h-8 object-cover rounded-sm" 
                                      />
                                    )}
                                    <span>{producto.nombre}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-marron text-center">${producto.precio}</TableCell>
                                <TableCell className="text-center">
                                  {parseInt(producto.stock) > 0 ? (
                                    <Badge variant="outline" className="!bg-crema !text-marron">
                                      {producto.stock}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                      Sin stock
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-marron">
                                  {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre_categoria || ""}
                                </TableCell>
                                <TableCell className="text-marron">
                                  {producto.tag ? (
                                    <Badge variant="outline" className="bg-marron/10 text-marron border-marron/20">
                                      {producto.tag}
                                    </Badge>
                                  ) : (
                                    <span className="text-marron/40 text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-marron hover:bg-marron/10"
                                      onClick={() => seleccionarProducto(producto)}
                                    >
                                      <span className="sr-only">Editar</span>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-marron hover:bg-red-100 hover:text-red-600"
                                        >
                                          <span className="sr-only">Eliminar</span>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="!bg-crema-oscuro">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="!text-marron">¿Está seguro?</AlertDialogTitle>
                                          <AlertDialogDescription className="!text-marron/70">
                                            Esta acción eliminará permanentemente el producto "{producto.nombre}".
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex justify-end items-center space-x-2">
                                          <AlertDialogCancel className="!bg-crema !border-marron/30 !text-marron hover:!bg-marron/5 h-10">
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="!bg-marron !text-crema hover:!bg-marron/90 h-10"
                                            onClick={() => eliminarProducto(producto.id_producto)}
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-marron/70">
                                {filtroProducto ? "No hay productos que coincidan con la búsqueda." : "No hay productos disponibles."}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Pestaña de Categorías */}
          <TabsContent value="categorias">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de categorías */}
              <div className="lg:col-span-1">
                <Card className="!bg-crema-oscuro border-marron/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl !text-marron">
                      {modoEdicionCategoria ? "Actualizar Categoría" : "Agregar Categoría"}
                    </CardTitle>
                    <CardDescription className="!text-marron/70">
                      Complete el formulario para {modoEdicionCategoria ? "actualizar la" : "agregar una"} categoría
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={modoEdicionCategoria ? actualizarCategoria : agregarCategoria} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombreCategoria" className="text-marron">Nombre de la Categoría</Label>
                        <Input
                          id="nombreCategoria"
                          placeholder="Ingrese nombre de la categoría"
                          value={nombreCategoria}
                          onChange={(e) => setNombreCategoria(e.target.value)}
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {modoEdicionCategoria ? (
                          <>
                            <Button 
                              type="submit"
                              className="w-full !bg-crema hover:!bg-marron/10 !text-marron"
                              disabled={isLoadingCategoria}
                            >
                              {isLoadingCategoria ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Actualizando...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Guardar Cambios
                                </>
                              )}
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              className="w-full !bg-crema !border-marron/10 !text-marron hover:!bg-marron/10"
                              onClick={cancelarEdicionCategoria}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button 
                            type="submit"
                            className="w-full !bg-crema hover:!bg-marron/5 !text-marron"
                            disabled={isLoadingCategoria}
                          >
                            {isLoadingCategoria ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Agregando...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Categoría
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Lista de categorías */}
              <div className="lg:col-span-2">
                <Card className="!bg-crema-oscuro border-marron/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-marron">
                      Categorías ({categorias.length})
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="!text-marron">ID</TableHead>
                            <TableHead className="!text-marron">Nombre</TableHead>
                            <TableHead className="!text-marron text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categorias.length > 0 ? (
                            categorias.map((categoria) => (
                              <TableRow key={categoria.id_categoria}>
                                <TableCell className="font-medium text-marron">#{categoria.id_categoria}</TableCell>
                                <TableCell className="text-marron">{categoria.nombre_categoria}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-marron hover:bg-marron/10"
                                      onClick={() => seleccionarCategoria(categoria)}
                                    >
                                      <span className="sr-only">Editar</span>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-marron hover:bg-red-100 hover:text-red-600"
                                        >
                                          <span className="sr-only">Eliminar</span>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="!bg-crema-oscuro">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="!text-marron">¿Está seguro?</AlertDialogTitle>
                                          <AlertDialogDescription className="!text-marron/70">
                                            Esta acción eliminará permanentemente la categoría "{categoria.nombre_categoria}" y puede afectar a los productos asociados.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="!bg-crema !border-marron/30 !text-marron hover:!bg-marron/5">
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="!bg-marron !text-crema hover:!bg-marron/90"
                                            onClick={() => eliminarCategoria(categoria.id_categoria)}
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center text-marron/70">
                                No hay categorías disponibles.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPanel;
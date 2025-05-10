import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../Context/CarritoContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import { Home, MapPin, Truck } from "lucide-react";

function Checkout() {
  const { actualizarCarrito } = useCarrito();
  const [formaEntrega, setFormaEntrega] = useState("retiro");
  const navigate = useNavigate();
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add("show"), 10);
    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => alertDiv.remove(), 310);
    }, 3000);
  }
  
  useEffect(() => {
    const cargarProductosCarrito = async () => {
      const carritoId = localStorage.getItem("sessionId");
      if (carritoId) {
        try {
          const response = await axios.get(`carrito/${carritoId}`);
          setProductosEnCarrito(response.data);
        } catch (error) {
          console.error("Error al cargar productos del carrito:", error);
        }
      }
    };

    cargarProductosCarrito();
  }, []);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const checkoutData = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      dni: formData.get("dni"),
      telefono: formData.get("numeroTelefono"),
      correo: formData.get("correoElectronico"),
      direccion:
        formaEntrega === "envio" ? formData.get("direccionEnvio") : "Local",
      ciudad: formaEntrega === "envio" ? formData.get("ciudad") : "",
      provincia: formaEntrega === "envio" ? formData.get("provincia") : "",
      codigo_postal: formaEntrega === "envio" ? formData.get("codigoPostal") : "",
      referenciaDeEntrega: formaEntrega,
      carritoId: localStorage.getItem("sessionId"),
    };

    try {
      const response = await axios.post("checkout", checkoutData);
      if (response.status === 200) {
        showAlert("¡Compra realizada con éxito!", "success");

        // Borra los productos del carrito
        const carritoId = localStorage.getItem("sessionId");
        await Promise.all(
          productosEnCarrito.map((producto) =>
            axios.delete(`carrito/${carritoId}/${producto.id_producto}`)
          )
        );
        await actualizarCarrito();
        localStorage.removeItem("carritoId");
        navigate("exito");
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "Ocurrió un error al realizar la compra. Por favor intenta nuevamente.",
        "error"
      );
      setIsSubmitting(false);
    }
  };

  const handleFormaEntregaChange = (value) => {
    setTimeout(() => {
      setFormaEntrega(value);
    }, 0);
  };

  return (
    <div className="bg-crema min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="!bg-crema-oscuro border-marron/10 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-marron text-center">
              Finalizar Compra
            </CardTitle>
            <p className="text-center text-marron/70">
              Complete sus datos para finalizar el proceso de compra
            </p>
          </CardHeader>
          
          <form onSubmit={handleCheckout}>
            <CardContent className="space-y-6">
              {/* Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-marron">Datos Personales</h3>
                <Separator className="!bg-marron/20" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-marron">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                      placeholder="Ingrese su nombre"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-marron">
                      Apellido
                    </Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                      placeholder="Ingrese su apellido"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dni" className="text-marron">
                      DNI
                    </Label>
                    <Input
                      id="dni"
                      name="dni"
                      className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                      placeholder="Ingrese su DNI"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numeroTelefono" className="text-marron">
                      Número de teléfono
                    </Label>
                    <Input
                      id="numeroTelefono"
                      name="numeroTelefono"
                      className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                      placeholder="Ej: 11 2345-6789"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="correoElectronico" className="text-marron">
                      Correo electrónico
                    </Label>
                    <Input
                      type="email"
                      id="correoElectronico"
                      name="correoElectronico"
                      className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Forma de Entrega */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-marron">Forma de Entrega</h3>
                <Separator className="!bg-marron/20" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opción de Retiro en Local */}
                  <div 
                    onClick={() => setFormaEntrega("retiro")} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      formaEntrega === "retiro" 
                        ? "border-marron bg-crema/80" 
                        : "border-marron/20 bg-crema hover:border-marron/40"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="formaEntrega"
                      id="retiro"
                      checked={formaEntrega === "retiro"}
                      onChange={() => setFormaEntrega("retiro")}
                      className="text-marron border-marron focus:ring-marron"
                      style={{ accentColor: '#8B4513' }}
                    />
                    <Label 
                      htmlFor="retiro" 
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <Home className="h-5 w-5 text-marron flex-shrink-0" />
                      <div>
                        <p className="font-medium text-marron">Retiro en local</p>
                        <p className="text-sm text-marron/70">Retira tu pedido en nuestro local</p>
                      </div>
                    </Label>
                  </div>
                  
                  {/* Opción de Envío a Domicilio */}
                  <div 
                    onClick={() => setFormaEntrega("envio")} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      formaEntrega === "envio" 
                        ? "border-marron bg-crema/80" 
                        : "border-marron/20 bg-crema hover:border-marron/40"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="formaEntrega"
                      id="envio"
                      checked={formaEntrega === "envio"}
                      onChange={() => setFormaEntrega("envio")}
                      className="text-marron border-marron focus:ring-marron"
                      style={{ accentColor: '#8B4513' }}
                    />
                    <Label 
                      htmlFor="envio" 
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <Truck className="h-5 w-5 text-marron flex-shrink-0" />
                      <div>
                        <p className="font-medium text-marron">Envío a domicilio</p>
                        <p className="text-sm text-marron/70">Recibe tu pedido en tu dirección</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Datos de Envío (condicional) */}
              {formaEntrega === "envio" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-marron">Datos de Envío</h3>
                  <Separator className="!bg-marron/20" />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="direccionEnvio" className="text-marron">
                        Dirección completa
                      </Label>
                      <Input
                        id="direccionEnvio"
                        name="direccionEnvio"
                        className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                        placeholder="Calle, número, piso, depto"
                        required={formaEntrega === "envio"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ciudad" className="text-marron">
                          Ciudad
                        </Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                          placeholder="Ingrese su ciudad"
                          required={formaEntrega === "envio"}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provincia" className="text-marron">
                          Provincia
                        </Label>
                        <Input
                          id="provincia"
                          name="provincia"
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                          placeholder="Ingrese su provincia"
                          required={formaEntrega === "envio"}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="codigoPostal" className="text-marron">
                          Código Postal
                        </Label>
                        <Input
                          id="codigoPostal"
                          name="codigoPostal"
                          className="!bg-crema border-marron/30 text-marron focus-visible:ring-marron/30 placeholder:text-marron/50"
                          placeholder="CP"
                          required={formaEntrega === "envio"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit"
                className="w-full bg-marron hover:bg-marron/80 text-crema py-6 text-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Finalizar Compra"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Checkout;

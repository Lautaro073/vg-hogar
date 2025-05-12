import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importaciones de componentes UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Lock, User } from "lucide-react"; // Iconos

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !password) {
      showAlert("Por favor, completa todos los campos.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("login", { user, password });
      const token = response.data.token;

      // Guardar token en localStorage
      localStorage.setItem("authToken", token);

      // Configurar axios para usar este token en solicitudes futuras
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      showAlert("Inicio de sesión exitoso!", "success");
      navigate("/login/cargarproductos");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      showAlert(
        "Error al iniciar sesión. Por favor, intenta de nuevo.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
  }, []);

  return (
    <div className="bg-crema min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md !bg-crema-oscuro border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-marron">
            Iniciar Sesión
          </CardTitle>
          <p className="text-marron/70">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user" className="text-marron">
                Usuario
              </Label>
              <div className="relative">
                <Input
                  id="user"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="!bg-white border-none text-marron focus-visible:ring-marron/30 pr-10 placeholder:text-marron/40"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User className="h-5 w-5 text-marron/60" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-marron">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!bg-white border-none text-marron focus-visible:ring-marron/30 pr-10 placeholder:text-marron/40"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-marron/60" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full !bg-marron hover:!bg-marron/80 text-[#e8d5b5] py-5 text-base font-medium mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-4 text-center">
          <p className="text-sm text-marron/60">
            Área restringida para administradores
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginForm() {
  return <Login />;
}

import React, { useState } from "react";
import { MessageCircle, Phone, MapPin, Clock } from "lucide-react";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el mensaje para WhatsApp
    const mensaje = `¡Hola! Me contacto desde la página web de VG Hogar.

*Información de contacto:*
• Nombre: ${formData.nombre}
• Teléfono: ${formData.telefono}
• Email: ${formData.email}

*Mensaje:*
${formData.mensaje}`;

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Número de WhatsApp del dueño
    const numeroWhatsApp = "+5492474415219";
    
    // Crear la URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // Limpiar el formulario
    setFormData({
      nombre: '',
      mensaje: ''
    });
  };

  return (
    <div className="bg-crema min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-marron mb-4">Contacto</h1>
          <div className="w-24 h-1 bg-marron mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-marron/70 leading-relaxed max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? ¡Estamos aquí para ayudarte!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de contacto */}
          <div className="bg-crema-oscuro rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-marron mb-6">Envíanos un mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-marron font-medium mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-marron/20 bg-crema focus:border-marron focus:outline-none transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-marron font-medium mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-marron/20 bg-crema focus:border-marron focus:outline-none transition-colors resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-marron hover:bg-marron/80 text-crema font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Enviar por WhatsApp
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-crema-oscuro rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-6 w-6 text-marron mr-3" />
                <h3 className="text-xl font-semibold text-marron">WhatsApp</h3>
              </div>
              <p className="text-marron/80 mb-2">¡Chatea con nosotros!</p>
              <a 
                href="https://wa.me/+5492474415219"
                target="_blank"
                rel="noopener noreferrer"
                className="text-marron hover:text-marron/80 font-medium"
              >
                +54 9 2474 41-5219
              </a>
            </div>

            <div className="bg-crema-oscuro rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-marron mr-3" />
                <h3 className="text-xl font-semibold text-marron">Teléfono</h3>
              </div>
              <p className="text-marron/80 mb-2">Llámanos directamente</p>
              <p className="text-marron font-medium">+54 9 2474 41-5219</p>
            </div>

            <div className="bg-crema-oscuro rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-marron mr-3" />
                <h3 className="text-xl font-semibold text-marron">Ubicación</h3>
              </div>
              <p className="text-marron/80 mb-2">Nos encontramos en:</p>
              <p className="text-marron font-medium">Salto, Provincia Bs As, Argentina</p>
            </div>

            <div className="bg-crema-oscuro rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-marron mr-3" />
                <h3 className="text-xl font-semibold text-marron">Horarios</h3>
              </div>
              <div className="text-marron/80 space-y-1">
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 13:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
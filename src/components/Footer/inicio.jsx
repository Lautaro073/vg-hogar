import React from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-crema-oscuro text-marron py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Iconos de redes sociales */}
          <div className="flex items-center space-x-6">
            <a
              href="https://instagram.com/siempre.bandidos?igshid=NTc4MTIwNjQ2YQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-marron/70 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-7 w-7" />
            </a>
            <a
              href="https://wa.me/+5493865575688"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-marron/70 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-7 w-7" />
            </a>
          </div>
          
          {/* Enlaces del footer */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="hover:text-marron/70 transition-colors">
              Inicio
            </Link>
            <Link to="/nosotros" className="hover:text-marron/70 transition-colors">
              Nosotros
            </Link>
            <Link to="/contacto" className="hover:text-marron/70 transition-colors">
              Contacto
            </Link>
            <Link to="/terminos" className="hover:text-marron/70 transition-colors">
              Términos y Condiciones
            </Link>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} VG Hogar. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

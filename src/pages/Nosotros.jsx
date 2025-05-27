import React from "react";
import { Heart, Award, Users, Truck } from "lucide-react";

function Nosotros() {
  return (
    <div className="bg-crema min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-marron mb-4">Sobre Nosotros</h1>
          <div className="w-24 h-1 bg-marron mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-marron/70 leading-relaxed max-w-2xl mx-auto">
            En VG Hogar nos dedicamos a hacer de tu casa el lugar más especial y acogedor.
          </p>
        </div>

        {/* Historia */}
        <div className="bg-crema-oscuro rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-marron mb-4">Nuestra Historia</h2>
          <p className="text-marron/80 leading-relaxed mb-4">
            VG Hogar nació de la pasión por crear espacios únicos y especiales. Comenzamos como un pequeño 
            emprendimiento familiar con la visión de ofrecer productos de calidad que transformen cualquier 
            casa en un verdadero hogar.
          </p>
          <p className="text-marron/80 leading-relaxed">
            Con años de experiencia en el sector, hemos crecido manteniendo siempre nuestros valores 
            fundamentales: calidad, compromiso con el cliente y atención personalizada.
          </p>
        </div>

        {/* Valores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-crema-oscuro rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-marron mr-3" />
              <h3 className="text-xl font-semibold text-marron">Pasión por el Hogar</h3>
            </div>
            <p className="text-marron/80">
              Creemos que cada hogar es único y merece productos que reflejen la personalidad 
              de quienes lo habitan.
            </p>
          </div>

          <div className="bg-crema-oscuro rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Award className="h-8 w-8 text-marron mr-3" />
              <h3 className="text-xl font-semibold text-marron">Calidad Garantizada</h3>
            </div>
            <p className="text-marron/80">
              Seleccionamos cuidadosamente cada producto para asegurar la máxima calidad 
              y durabilidad en el tiempo.
            </p>
          </div>

          <div className="bg-crema-oscuro rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-marron mr-3" />
              <h3 className="text-xl font-semibold text-marron">Atención Personalizada</h3>
            </div>
            <p className="text-marron/80">
              Nuestro equipo está siempre disponible para asesorarte y ayudarte a encontrar 
              exactamente lo que necesitas.
            </p>
          </div>

          <div className="bg-crema-oscuro rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-8 w-8 text-marron mr-3" />
              <h3 className="text-xl font-semibold text-marron">Entrega Confiable</h3>
            </div>
            <p className="text-marron/80">
              Trabajamos para que recibas tus productos en tiempo y forma, cuidando cada 
              detalle del proceso de entrega.
            </p>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-crema-oscuro rounded-lg p-6">
            <h3 className="text-xl font-semibold text-marron mb-4">Nuestra Misión</h3>
            <p className="text-marron/80">
              Brindar productos de calidad que transformen espacios en hogares acogedores, 
              ofreciendo una experiencia de compra excepcional y un servicio personalizado 
              que supere las expectativas de nuestros clientes.
            </p>
          </div>

          <div className="bg-crema-oscuro rounded-lg p-6">
            <h3 className="text-xl font-semibold text-marron mb-4">Nuestra Visión</h3>
            <p className="text-marron/80">
              Ser la empresa líder en productos para el hogar, reconocida por nuestra 
              calidad, innovación y compromiso con la satisfacción del cliente, 
              contribuyendo a crear hogares más hermosos y funcionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
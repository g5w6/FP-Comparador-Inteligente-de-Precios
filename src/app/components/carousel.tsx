"use client"; // Indica que este componente debe ser renderizado en el cliente

import { useEffect, useState } from "react"; // Importa hooks de React

// Array de rutas de las imágenes del carrusel
const carouselImages = [
  "/christopher-gower-m_HRfLhgABo-unsplash.jpg",
  "/farzad-p-xSl33Wxyc-unsplash.jpg",
  "/ferenc-almasi-eYpcLDXHVb0-unsplash.jpg",
];

const Carousel = ({
  text1,
  text2,
  text3,
  text4,
}: {
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para el índice actual de la imagen

  useEffect(() => {
    // Configura un intervalo para cambiar la imagen cada 8 segundos
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 50000); // Cambia de imagen cada 8 segundos

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Contenedor del texto */}
      <div className="absolute z-20 top-1/3 left-80">
        <h2 className="text-white text-3xl font-bold">{text1}</h2>
        <h1 className="text-white text-7xl font-bold">{text2}</h1>
        <h1 className="text-white text-7xl font-bold">{text3}</h1>
        <h2 className="text-white text-5xl font-bold">{text4}</h2>
      </div>
      {/* Contenedor del carrusel */}
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Transición para mover las imágenes
      >
        {carouselImages.map((image, index) => (
          <div key={index} className="min-w-full">
            {/* Cada imagen ocupa el 100% del ancho del contenedor */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-150" // Imagen con ancho completo y altura automática
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel; // Exporta el componente Carousel

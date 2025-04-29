"use client"; // Indica que este componente debe ser renderizado en el cliente

import Image from "next/image";
import { useState } from "react";

interface SliderProductsProps {
  image: string;
  name: string;
  oldPrice: number;
  newPrice: number;
}

// Componente del slider products
const SliderProducts: React.FC<SliderProductsProps> = ({
  image,
  name,
  oldPrice,
  newPrice,
}) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div
      className=" mt-6 rounded-lg p-2 w-85 h-160 shadow-lg bg-white flex flex-col
    hover:border-1 focus:outline-2 transition-transform duration-300 ease-in-out transform hover:scale-105"
    >
      <div className="flex justify-center my-2 flex-grow">
        <div className="relative w-full h-95">
          {" "}
          {/* Ajusta el tamaño del contenedor de la imagen */}
          <Image
            src={image}
            alt={name}
            layout="fill" // Usa layout="fill" para que la imagen llene el contenedor
            objectFit="contain" // Usa objectFit="contain" para que la imagen se ajuste sin desbordarse
            className="rounded-md"
          />
        </div>
      </div>

      {/* Inicio de div con el nombre del producto y precios */}
      <div className="mb-2">
        <h3 className="text-center text-gray-800 text-lg overflow-hidden text-ellipsis whitespace-nowrap max-h-12">
          {name}
        </h3>
        <div className="text-center mt-2">
          <p className="text-gray-500 line-through text-lg">
            ${oldPrice.toFixed(2)}
          </p>
          <p className="text-red-600 font-bold text-xl">
            ${newPrice.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Fin de div con el nombre del producto y precios */}

      {/* Inicio de div con botones de cantidad y agregar a la lista */}
      <div>
        <div className="flex justify-center items-center gap-2 mt-3">
          <button
            onClick={decreaseQuantity}
            className="bg-gray-300 text-black px-2 rounded"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="bg-gray-300 text-black px-2 rounded"
          >
            +
          </button>
        </div>
        <button className="bg-black text-white w-full mt-3 py-2 rounded-lg">
          Agregar a la lista
        </button>
      </div>
      {/* Fin de div con botones de cantidad y agregar a la lista */}
    </div>
  );
};

//  Componente Products (lista de productos)
const Sproduct = () => {
  const products = [
    {
      image: "/high-angle-tasty-fruits-arrangement.jpg",
      name: "Aguacates Hass en su punto.",
      oldPrice: 79.99,
      newPrice: 71.99,
    },
    {
      image: "/fresh-banana-orange-strawberries-blue-board-min.jpg",
      name: "Muslos de pollo sin hueso.",
      oldPrice: 76.5,
      newPrice: 68.85,
    },
    {
      image: "/close-up-assortment-organic-fruits-min.jpg",
      name: "Filete de atún 0.5 kg.",
      oldPrice: 399.99,
      newPrice: 359.99,
    },
    {
      image: "/farzad-p-xSl33Wxyc-unsplash.jpg",
      name: "Queso crema para untar 8 oz.",
      oldPrice: 49.99,
      newPrice: 44.99,
    },
    {
      image: "/high-angle-tasty-fruits-arrangement.jpg",
      name: "Queso crema para untar 8 oz.",
      oldPrice: 49.99,
      newPrice: 44.99,
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto p-5">
      {products.map((product, index) => (
        <SliderProducts key={index} {...product} />
      ))}
    </div>
  );
};

interface PrecioProps {
  productoId: number;
  establecimiento: string;
  precio: number;
}

interface ProductsProps {
  precios: PrecioProps[];
}

const Products = ({ precios = [] }: ProductsProps) => {
  if (precios.length === 0) {
    return (
      <div className="text-center p-4">
        No se encontraron precios para este producto
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {precios.map((precio, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-gray-200 relative">
              {/* Puedes reemplazar esto con imágenes reales de los establecimientos */}
              <Image
                src={`/images/stores/placeholder.jpg`}
                alt={precio.establecimiento}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-bold text-xl mb-2">
                {precio.establecimiento}
              </h2>
              <p className="text-gray-700 text-lg font-semibold">
                ${precio.precio.toFixed(2)}
              </p>
              <div className="mt-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

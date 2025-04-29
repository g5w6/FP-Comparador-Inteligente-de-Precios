"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../index/carrito";
import { supabase } from "../lib/supabaseClient";

// Definir interfaces para los datos
interface Producto {
  id_producto: number;
  nombre_producto: string;
  peso_producto: string;
  id_categoria: number;
}

interface Precio {
  id_precio: number;
  precio_producto: number;
  id_producto: number;
  id_establecimiento: number;
  establecimientos?: {
    nombre_establecimiento: string;
  };
}

interface ProductoConPrecio {
  id: number;
  nombre: string;
  precio: number;
  establecimiento: string;
}

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<ProductoConPrecio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Número de productos a mostrar a la vez (según el ancho de pantalla)
  const [productsToShow, setProductsToShow] = useState(4);

  useEffect(() => {
    // Función para ajustar el número de productos según el ancho de pantalla
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        setProductsToShow(1);
      } else if (width < 768) {
        setProductsToShow(2);
      } else if (width < 1024) {
        setProductsToShow(3);
      } else {
        setProductsToShow(4);
      }
    }

    // Configurar el listener para el resize
    handleResize(); // Llamada inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProductosAleatorios = async () => {
      try {
        console.log("Obteniendo productos aleatorios...");

        // 1. Obtener todos los productos
        const { data: productosData, error: productosError } = await supabase
          .from("productos")
          .select("id_producto, nombre_producto");

        if (productosError) {
          throw productosError;
        }

        if (!productosData || productosData.length === 0) {
          setError("No se encontraron productos");
          return;
        }

        // 2. Seleccionar 8 productos aleatorios (en lugar de 5)
        const productosAleatorios = getRandomItems(productosData, 8);
        console.log("Productos aleatorios seleccionados:", productosAleatorios);

        // 3. Para cada producto aleatorio, obtener su mejor precio
        const productosConPrecios: ProductoConPrecio[] = [];
        const cantidadesIniciales: { [key: number]: number } = {};

        for (const producto of productosAleatorios) {
          // Obtener los precios para este producto
          const { data: preciosData, error: preciosError } = await supabase
            .from("precios")
            .select(
              `
              precio_producto,
              establecimientos:id_establecimiento(nombre_establecimiento)
            `
            )
            .eq("id_producto", producto.id_producto)
            .order("precio_producto", { ascending: true })
            .limit(1);

          if (preciosError) {
            console.error(
              `Error al obtener precios para el producto ${producto.id_producto}:`,
              preciosError
            );
            continue;
          }

          if (preciosData && preciosData.length > 0) {
            const precio = preciosData[0];
            productosConPrecios.push({
              id: producto.id_producto,
              nombre: producto.nombre_producto,
              precio: precio.precio_producto,
              establecimiento:
                precio.establecimientos?.nombre_establecimiento ||
                "Desconocido",
            });

            // Inicializar cantidad para este producto
            cantidadesIniciales[producto.id_producto] = 1;
          }
        }

        console.log("Productos con precios:", productosConPrecios);
        setProductos(productosConPrecios);
        setCantidades(cantidadesIniciales);
      } catch (error) {
        console.error("Error al obtener productos aleatorios:", error);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductosAleatorios();
  }, []);

  // Función para obtener elementos aleatorios de un array
  const getRandomItems = (arr: any[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Función para incrementar la cantidad
  const incrementarCantidad = (productoId: number) => {
    setCantidades((prev) => ({
      ...prev,
      [productoId]: (prev[productoId] || 1) + 1,
    }));
  };

  // Función para decrementar la cantidad (mínimo 1)
  const decrementarCantidad = (productoId: number) => {
    setCantidades((prev) => ({
      ...prev,
      [productoId]: Math.max(1, (prev[productoId] || 1) - 1),
    }));
  };

  const { addItem, openCart } = useCart();

  // Reemplazar la función agregarALista
  const agregarALista = (producto: ProductoConPrecio, cantidad: number) => {
    addItem(
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        establecimiento: producto.establecimiento,
      },
      cantidad
    );
    openCart(); // Abre el carrito al agregar un producto
  };

  // Funciones para el slider
  const nextSlide = () => {
    if (currentIndex + productsToShow >= productos.length) {
      // Si estamos al final, volver al principio
      setCurrentIndex(0);
    } else {
      // Avanzar
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      // Si estamos al principio, ir al final
      setCurrentIndex(Math.max(0, productos.length - productsToShow));
    } else {
      // Retroceder
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Productos visibles actualmente en el slider
  const visibleProducts = productos.slice(
    currentIndex,
    currentIndex + productsToShow
  );

  return (
    <div className="max-w-[1240px] mx-auto p-4 relative">
      {/* Contenedor del slider con botones de navegación */}
      <div className="relative mb-14">
        {/* Botón anterior - Ajustado más a la izquierda */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
          disabled={currentIndex === 0 && productos.length <= productsToShow}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Contenedor de productos - Ajustado con más padding */}
        <div
          ref={sliderRef}
          className="flex transition-all duration-300 ease-in-out gap-4 px-10"
        >
          {visibleProducts.map((producto) => {
            const cantidad = cantidades[producto.id] || 1;

            return (
              <div
                key={producto.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-[500px] min-w-[275px] max-w-[300px] flex-1 overflow-hidden"
              >
                {/* Imagen */}
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-center px-2">
                    {producto.nombre}
                  </span>
                </div>

                {/* Información del producto - Contenedor con overflow hidden */}
                <div className="mb-4 flex-1 overflow-hidden">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <div className="mb-2">
                    <p className="text-gray-600 text-sm mb-1">
                      Menor precio en:
                    </p>
                    <p className="text-gray-800 font-medium text-sm mb-2 break-words line-clamp-2">
                      {producto.establecimiento}
                    </p>
                  </div>
                  <p className="text-red-600 font-bold text-xl">
                    ${producto.precio.toFixed(2)}
                  </p>
                </div>

                {/* Controles de cantidad - Tamaño reducido */}
                <div className="flex items-center mb-3 flex-shrink-0">
                  <span className="mr-2 text-xs font-medium">Cantidad:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        decrementarCantidad(producto.id);
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 min-w-[25px] text-center text-sm">
                      {cantidad}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        incrementarCantidad(producto.id);
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contenedor para los botones - Más compacto */}
                <div className="mt-auto grid grid-cols-1 gap-2 flex-shrink-0">
                  <Link
                    href={`/productname?nombre=${encodeURIComponent(
                      producto.nombre
                    )}`}
                    className="bg-blue-600 text-white py-2 px-3 rounded text-center hover:bg-blue-700 transition-colors text-sm"
                  >
                    Ver detalles
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      agregarALista(producto, cantidad);
                    }}
                    className="bg-red-600 text-white py-2 px-3 rounded text-center hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Agregar a la lista
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón siguiente - Ajustado más a la derecha */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-8 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
          disabled={
            currentIndex >= productos.length - productsToShow &&
            productos.length <= productsToShow
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Indicadores de paginación - Colocados en la parte inferior con más espacio */}
        <div className="absolute bottom-[-30px] left-0 right-0 flex justify-center gap-2">
          {Array.from({
            length: Math.ceil(productos.length / productsToShow),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * productsToShow)}
              className={`h-2 w-10 rounded-full transition-all ${
                index === Math.floor(currentIndex / productsToShow)
                  ? "bg-red-600"
                  : "bg-gray-300"
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

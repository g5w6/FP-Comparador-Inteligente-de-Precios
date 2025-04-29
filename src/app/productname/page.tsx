"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../index/carrito";
import { supabase } from "../lib/supabaseClient";

// Definir interfaces para los datos
interface PrecioProducto {
  id_precio: number;
  id_producto: number;
  id_establecimiento: number;
  precio_producto: number;
  nombre_establecimiento: string;
}

// Interfaz para las props del componente ProductsComponent
interface ProductsComponentProps {
  precios: PrecioProducto[];
  nombreProducto: string;
}

// Componente para mostrar los precios de los productos
const ProductsComponent = ({
  precios,
  nombreProducto,
}: ProductsComponentProps) => {
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const { addItem, openCart, isOpen } = useCart();
  const [shouldOpenCart, setShouldOpenCart] = useState(false);

  // Inicializar cantidades al cargar el componente
  useEffect(() => {
    const cantidadesIniciales: { [key: number]: number } = {};
    precios.forEach((precio) => {
      cantidadesIniciales[precio.id_precio] = 1;
    });
    setCantidades(cantidadesIniciales);
  }, [precios]);

  // Usa un efecto para abrir el carrito solo una vez después de agregar el primer producto
  useEffect(() => {
    if (shouldOpenCart) {
      openCart();
      setShouldOpenCart(false);
    }
  }, [shouldOpenCart, openCart]);

  // Función para incrementar la cantidad
  const incrementarCantidad = (precioId: number) => {
    setCantidades((prev) => ({
      ...prev,
      [precioId]: (prev[precioId] || 1) + 1,
    }));
  };

  // Función para decrementar la cantidad
  const decrementarCantidad = (precioId: number) => {
    setCantidades((prev) => ({
      ...prev,
      [precioId]: Math.max(1, (prev[precioId] || 1) - 1),
    }));
  };

  // Función para agregar a la lista
  const agregarALista = (
    productoId: number,
    establecimiento: string,
    precio: number,
    cantidad: number
  ) => {
    // Agregar el producto al carrito sin abrir el carrito
    addItem(
      {
        id: productoId,
        nombre: nombreProducto,
        precio: precio,
        establecimiento: establecimiento,
      },
      cantidad
    );

    // Si el carrito está cerrado, configurar para abrirlo una sola vez
    if (!isOpen) {
      setShouldOpenCart(true);
    }
  };

  return (
    <div className="w-full max-w-7xl p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center md:text-left">
        Precios en diferentes establecimientos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {precios.map((precio) => {
          const cantidad = cantidades[precio.id_precio] || 1;

          return (
            <div
              key={precio.id_precio}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Contenedor de imagen responsive */}
              <div className="h-32 md:h-40 bg-gray-100 rounded-md mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-500 text-center px-3 text-sm md:text-base">
                  {nombreProducto}
                </span>
              </div>

              <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-1">
                {precio.nombre_establecimiento}
              </h3>
              <div className="mb-3 md:mb-4">
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  ${precio.precio_producto.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center mb-3 md:mb-4">
                <span className="mr-2 text-sm md:text-base">Cantidad:</span>
                <div className="flex border rounded">
                  <button
                    onClick={() => decrementarCantidad(precio.id_precio)}
                    className="px-2 md:px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                  >
                    -
                  </button>
                  <span className="px-2 md:px-3 py-1 min-w-[32px] md:min-w-[40px] text-center text-sm md:text-base">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => incrementarCantidad(precio.id_precio)}
                    className="px-2 md:px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() =>
                  agregarALista(
                    precio.id_producto,
                    precio.nombre_establecimiento,
                    precio.precio_producto,
                    cantidad
                  )
                }
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                Agregar a la lista
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const nombreProducto = searchParams.get("nombre") || "Producto";

  const [precios, setPrecios] = useState<PrecioProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreciosProducto() {
      try {
        // Primero obtener el ID del producto por su nombre
        const { data: productoData, error: productoError } = await supabase
          .from("productos")
          .select("id_producto")
          .eq("nombre_producto", nombreProducto)
          .single();

        if (productoError) {
          throw productoError;
        }

        if (!productoData) {
          setError("Producto no encontrado");
          return;
        }

        const idProducto = productoData.id_producto;

        // Luego obtener los precios para ese producto
        const { data: preciosData, error: preciosError } = await supabase
          .from("precios")
          .select(
            `
            id_precio,
            id_producto,
            id_establecimiento,
            precio_producto,
            establecimientos(nombre_establecimiento)
          `
          )
          .eq("id_producto", idProducto);

        if (preciosError) {
          throw preciosError;
        }

        // Formatear los datos para tener una estructura más plana
        const preciosFormateados = preciosData.map((precio) => ({
          id_precio: precio.id_precio,
          id_producto: precio.id_producto,
          id_establecimiento: precio.id_establecimiento,
          precio_producto: precio.precio_producto,
          nombre_establecimiento:
            precio.establecimientos.nombre_establecimiento,
        }));

        setPrecios(preciosFormateados);
      } catch (error) {
        console.error("Error al cargar precios:", error);
        setError("Error al cargar información de precios");
      } finally {
        setLoading(false);
      }
    }

    fetchPreciosProducto();
  }, [nombreProducto]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex justify-center items-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center break-words max-w-full">
          {nombreProducto}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          <span className="ml-3 text-lg">
            Cargando información del producto...
          </span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-10 px-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-md text-center">
            <p className="font-medium">{error}</p>
            <p className="mt-2 text-sm">
              Intenta con otro producto o vuelve más tarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-start">
          <ProductsComponent
            precios={precios}
            nombreProducto={nombreProducto}
          />
        </div>
      )}
    </div>
  );
}

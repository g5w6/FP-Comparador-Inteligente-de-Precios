"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../index/carrito";
import { supabase } from "../lib/supabaseClient";

// Función auxiliar para formatear precios con seguridad
const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0.00";
  }
  return price.toFixed(2);
};

interface PrecioAlternativo {
  id_establecimiento: number;
  establecimiento: string;
  direccion?: string;
  municipio?: string;
  total: number;
  ahorro: number;
  productos: {
    id: number;
    nombre: string;
    precio: number;
    disponible: boolean;
    cantidad?: number;
  }[];
}

const Cart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    closeCart,
    totalItems,
    totalPrice,
    addItem,
  } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const [preciosAlternativos, setPreciosAlternativos] = useState<
    PrecioAlternativo[]
  >([]);
  const [cargandoComparacion, setCargandoComparacion] = useState(false);
  const [errorComparacion, setErrorComparacion] = useState<string | null>(null);
  const [mostrarComparacion, setMostrarComparacion] = useState(false);
  const [aplicandoCambios, setAplicandoCambios] = useState(false);

  // Cerrar carrito al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeCart]);

  // Calcular precios alternativos cuando cambian los items del carrito
  useEffect(() => {
    if (items.length > 0 && mostrarComparacion) {
      compararPrecios();
    } else {
      setPreciosAlternativos([]);
    }
  }, [items, mostrarComparacion]);

  // Función para aplicar cambios al carrito basados en una alternativa seleccionada
  const aplicarCambiosAlCarrito = async (alternativa: PrecioAlternativo) => {
    try {
      setAplicandoCambios(true);

      // 1. Vaciar el carrito actual
      clearCart();

      // 2. Para cada producto en la alternativa, necesitamos obtener la información completa
      for (const producto of alternativa.productos) {
        // Obtener información detallada del producto
        const { data: productoData } = await supabase
          .from("productos")
          .select("*")
          .eq("id_producto", producto.id)
          .single();

        if (productoData) {
          // Obtener información detallada del establecimiento
          const { data: establecimientoData } = await supabase
            .from("establecimientos")
            .select("*")
            .eq("id_establecimiento", alternativa.id_establecimiento)
            .single();

          // Añadir el producto al carrito
          if (establecimientoData) {
            addItem({
              id: producto.id,
              nombre: productoData.nombre_producto,
              precio: producto.precio,
              cantidad: producto.cantidad || 1, // Usar la cantidad original o 1 por defecto
              establecimiento: alternativa.establecimiento,
              direccion_establecimiento: alternativa.direccion || "",
              municipio_establecimiento: alternativa.municipio || "",
              id_establecimiento: alternativa.id_establecimiento,
            });
          }
        }
      }

      // 3. Mostrar mensaje de éxito (opcional)
      alert("¡Carrito actualizado con la alternativa seleccionada!");

      // 4. Cerrar la sección de comparación
      setMostrarComparacion(false);
    } catch (error) {
      console.error("Error al aplicar cambios al carrito:", error);
      alert("Ha ocurrido un error al actualizar el carrito");
    } finally {
      setAplicandoCambios(false);
    }
  };

  // Función para comparar precios en diferentes establecimientos
  const compararPrecios = async () => {
    if (items.length === 0) return;

    setCargandoComparacion(true);
    setErrorComparacion(null);

    try {
      // 1. Obtener los IDs de productos en el carrito y sus cantidades
      const productosEnCarrito = items.map((item) => ({
        id: item.id,
        cantidad: item.cantidad,
      }));

      // 2. Obtener todos los establecimientos disponibles con sus direcciones
      const { data: establecimientos, error: errorEstablecimientos } =
        await supabase
          .from("establecimientos")
          .select(
            "id_establecimiento, nombre_establecimiento, direccion_establecimiento, municipio_establecimiento"
          );

      if (errorEstablecimientos)
        throw new Error("Error al obtener establecimientos");

      // 3. Para cada producto, obtener todos los precios en diferentes establecimientos
      const preciosPorProducto: Record<
        number,
        {
          establecimiento_id: number;
          establecimiento: string;
          direccion?: string;
          municipio?: string;
          precio: number;
        }[]
      > = {};

      for (const producto of productosEnCarrito) {
        const { data: precios, error: errorPrecios } = await supabase
          .from("precios")
          .select(
            `
            precio_producto,
            id_establecimiento,
            establecimientos(
              nombre_establecimiento, 
              direccion_establecimiento,
              municipio_establecimiento
            )
          `
          )
          .eq("id_producto", producto.id);

        if (errorPrecios)
          throw new Error(
            `Error al obtener precios para el producto ${producto.id}`
          );

        if (precios) {
          preciosPorProducto[producto.id] = precios.map((p) => ({
            establecimiento_id: p.id_establecimiento,
            establecimiento:
              p.establecimientos?.nombre_establecimiento || "Desconocido",
            direccion: p.establecimientos?.direccion_establecimiento,
            municipio: p.establecimientos?.municipio_establecimiento,
            precio: p.precio_producto,
          }));
        }
      }

      // 4. Calcular el total por establecimiento para los productos en el carrito
      const totalesPorEstablecimiento: PrecioAlternativo[] = [];

      if (establecimientos) {
        for (const est of establecimientos) {
          const productosEnEstablecimiento = productosEnCarrito.map((item) => {
            // Buscar el precio de este producto en este establecimiento
            const precioEnEstablecimiento = preciosPorProducto[item.id]?.find(
              (p) => p.establecimiento_id === est.id_establecimiento
            );

            // Buscar el nombre del producto original
            const productoOriginal = items.find((i) => i.id === item.id);

            return {
              id: item.id,
              nombre: productoOriginal?.nombre || "Producto desconocido",
              precio: precioEnEstablecimiento?.precio || 0,
              disponible: !!precioEnEstablecimiento,
              cantidad: item.cantidad,
            };
          });

          // Calcular el total solo si todos los productos están disponibles
          const todosDisponibles = productosEnEstablecimiento.every(
            (p) => p.disponible
          );

          if (todosDisponibles) {
            const total = productosEnEstablecimiento.reduce(
              (sum, product) => sum + product.precio * (product.cantidad || 1),
              0
            );

            const ahorro = totalPrice - total;

            // Incluir solo si es una tienda diferente o hay ahorro
            const esEstablecimientoDiferente = !items.every(
              (item) => item.establecimiento === est.nombre_establecimiento
            );

            if (esEstablecimientoDiferente || ahorro > 0) {
              totalesPorEstablecimiento.push({
                id_establecimiento: est.id_establecimiento,
                establecimiento: est.nombre_establecimiento,
                direccion: est.direccion_establecimiento,
                municipio: est.municipio_establecimiento,
                total,
                ahorro,
                productos: productosEnEstablecimiento.map((p) => ({
                  id: p.id,
                  nombre: p.nombre,
                  precio: p.precio,
                  disponible: p.disponible,
                  cantidad: p.cantidad,
                })),
              });
            }
          }
        }
      }

      // 5. Ordenar por menor precio
      const alternativasOrdenadas = totalesPorEstablecimiento
        .filter((alt) => alt.ahorro > 0)
        .sort((a, b) => a.total - b.total);

      setPreciosAlternativos(alternativasOrdenadas);
    } catch (error) {
      console.error("Error al comparar precios:", error);
      setErrorComparacion("No se pudieron calcular alternativas de compra.");
    } finally {
      setCargandoComparacion(false);
    }
  };

  // Sección de comparación de precios
  const renderComparacion = () => {
    if (cargandoComparacion) {
      return (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-r-2 border-red-600"></div>
            <span className="ml-2">Comparando precios...</span>
          </div>
        </div>
      );
    }

    if (errorComparacion) {
      return (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-red-600">{errorComparacion}</p>
        </div>
      );
    }

    if (preciosAlternativos.length === 0 && mostrarComparacion) {
      return (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-gray-600 text-sm">
            No se encontraron alternativas más económicas para tu lista de
            compras.
          </p>
        </div>
      );
    }

    if (preciosAlternativos.length > 0) {
      return (
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            Alternativas más económicas
          </h3>

          {/* Contenedor con scroll para las alternativas */}
          <div className="max-h-80 overflow-y-auto pr-1">
            {preciosAlternativos.map((alternativa, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white rounded-md shadow-sm border border-gray-200"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <span className="font-medium text-lg">
                      {alternativa.establecimiento}
                    </span>
                    {alternativa.municipio && (
                      <p className="text-sm text-gray-500 mt-1">
                        {alternativa.municipio}
                      </p>
                    )}
                    {alternativa.direccion && (
                      <p className="text-xs text-gray-500">
                        {alternativa.direccion}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold text-lg">
                      Ahorras ${formatPrice(alternativa.ahorro)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span>Total:</span>
                  <span className="font-bold text-lg">
                    ${formatPrice(alternativa.total)}
                  </span>
                </div>

                {/* Botón para aplicar cambios */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => aplicarCambiosAlCarrito(alternativa)}
                    disabled={aplicandoCambios}
                    className={`w-full py-2 px-4 rounded-md text-center transition-colors ${
                      aplicandoCambios
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {aplicandoCambios ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Actualizando...
                      </span>
                    ) : (
                      "Aplicar esta opción"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Contenido del carrito
  return (
    <div
      ref={cartRef}
      className={`fixed z-50 inset-y-0 right-0 w-full md:w-[28rem] lg:w-[32rem] bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out flex flex-col h-full`}
    >
      <div className="border-b border-gray-200 p-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <svg
            className="w-6 h-6 text-gray-700 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          Mi Lista de Compras ({totalItems || 0})
        </h2>
        <button
          onClick={closeCart}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Estado del carrito */}
      {!items || items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <svg
            className="w-20 h-20 text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-600 text-center mb-6 text-lg">
            Tu lista de compras está vacía
          </p>
          <button
            onClick={closeCart}
            className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors text-lg"
          >
            Seguir comprando
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-5">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.establecimiento}-${index}`}
                className="border-b border-gray-200 py-5 flex"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium text-lg">
                    {item.nombre}
                  </h3>

                  <div className="mt-1 mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      {item.establecimiento}
                    </p>
                    {item.direccion_establecimiento && (
                      <p className="text-xs text-gray-500">
                        {item.direccion_establecimiento}
                      </p>
                    )}
                    {item.municipio_establecimiento && (
                      <p className="text-xs text-gray-500">
                        {item.municipio_establecimiento}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center mt-3 justify-between">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, (item.cantidad || 1) - 1),
                            item.establecimiento
                          )
                        }
                        className="px-3 py-1 border-r border-gray-300"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 min-w-[40px] text-center">
                        {item.cantidad || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            (item.cantidad || 1) + 1,
                            item.establecimiento
                          )
                        }
                        className="px-3 py-1 border-l border-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800 font-medium text-lg">
                        ${formatPrice(item.precio * (item.cantidad || 1))}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${formatPrice(item.precio)} c/u
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.establecimiento)}
                    className="text-red-600 text-sm mt-3 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-5 bg-gray-50">
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">${formatPrice(totalPrice)}</span>
            </div>

            {/* Botón para comparar precios */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setMostrarComparacion(!mostrarComparacion);
                  if (!mostrarComparacion && preciosAlternativos.length === 0) {
                    compararPrecios();
                  }
                }}
                className="w-full py-3 px-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors text-base mb-2"
              >
                {mostrarComparacion
                  ? "Ocultar comparación de precios"
                  : "Comparar precios en otras tiendas"}
              </button>
            </div>

            {/* Mostrar comparación de precios */}
            {mostrarComparacion && renderComparacion()}

            <div className="flex flex-col space-y-3 mt-4">
              <Link
                href="/checkout"
                className="bg-red-600 text-white py-3 px-4 rounded-md text-center hover:bg-red-700 transition-colors text-lg"
                onClick={closeCart}
              >
                Proceder al pago
              </Link>
              <button
                onClick={clearCart}
                className="text-red-600 py-2 hover:text-red-800 text-base"
              >
                Vaciar lista
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

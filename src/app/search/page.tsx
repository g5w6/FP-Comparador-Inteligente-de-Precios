"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio_minimo?: number;
  establecimiento?: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar productos que coincidan con la consulta
        const { data: productosData, error: productosError } = await supabase
          .from("productos")
          .select("id_producto, nombre_producto")
          .ilike("nombre_producto", `%${query}%`)
          .order("nombre_producto");

        if (productosError) throw productosError;

        // Para cada producto, obtener el precio más bajo
        const productosConPrecios = await Promise.all(
          (productosData || []).map(async (producto) => {
            const { data: preciosData } = await supabase
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

            const precio =
              preciosData && preciosData.length > 0
                ? {
                    precio_minimo: preciosData[0].precio_producto,
                    establecimiento:
                      preciosData[0].establecimientos?.nombre_establecimiento ||
                      "Desconocido",
                  }
                : { precio_minimo: undefined, establecimiento: undefined };

            return {
              ...producto,
              ...precio,
            };
          })
        );

        setProductos(productosConPrecios);
      } catch (err) {
        console.error("Error al buscar productos:", err);
        setError("Ha ocurrido un error al buscar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Resultados para: <span className="text-red-600">"{query}"</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : productos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            No se encontraron productos que coincidan con tu búsqueda.
          </p>
          <p className="text-gray-500">
            Intenta con otros términos o explora nuestras categorías.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <Link
              href={`/productname?nombre=${encodeURIComponent(
                producto.nombre_producto
              )}`}
              key={producto.id_producto}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col"
            >
              <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400">
                  {producto.nombre_producto}
                </span>
              </div>
              <h2 className="font-semibold text-lg mb-2">
                {producto.nombre_producto}
              </h2>
              {producto.precio_minimo ? (
                <>
                  <p className="text-gray-600 text-sm mb-1">
                    Menor precio en: {producto.establecimiento}
                  </p>
                  <p className="text-red-600 font-bold mt-auto">
                    ${producto.precio_minimo.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic mt-auto">
                  Precios no disponibles
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

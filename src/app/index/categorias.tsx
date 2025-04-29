"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

interface Producto {
  id_producto: number;
  nombre_producto: string;
  peso_producto: string;
  id_categoria: number;
}

interface CategoriaConProductos {
  id: number;
  name: string;
  items: string[];
}

const Categorias = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoriaConProductos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>(
    "Comprobando conexión..."
  );

  // Test de conexión al montar el componente
  useEffect(() => {
    async function testConnection() {
      try {
        console.log("Probando conexión a Supabase...");

        // Query simple que debería funcionar independientemente de la estructura de la base de datos
        const { data, error } = await supabase
          .from("categorias")
          .select("count", { count: "exact", head: true });

        console.log("Respuesta de prueba de conexión:", { data, error });

        if (error) {
          console.error("Error de conexión:", error);
          setConnectionStatus(`❌ Error de conexión: ${error.message}`);
        } else {
          console.log("Conexión exitosa a Supabase");
          setConnectionStatus("✅ Conexión exitosa a Supabase");
        }
      } catch (e) {
        console.error("Error inesperado al probar conexión:", e);
        setConnectionStatus(
          `❌ Error inesperado al conectar: ${
            e instanceof Error ? e.message : String(e)
          }`
        );
      }
    }

    testConnection();
  }, []);

  useEffect(() => {
    const fetchCategoriasYProductos = async () => {
      try {
        console.log("Obteniendo categorías y productos...");

        // Primero obtenemos todas las categorías
        const { data: categorias, error: categoriasError } = await supabase
          .from("categorias")
          .select("id_categoria, nombre_categoria");

        console.log("Respuesta de categorías:", categorias);

        if (categoriasError) {
          console.error("Error al obtener categorías:", categoriasError);
          setError(categoriasError.message);
          return;
        }

        if (!categorias || categorias.length === 0) {
          console.log("No se encontraron categorías");
          setLoading(false);
          return;
        }

        // Luego obtenemos todos los productos
        const { data: productos, error: productosError } = await supabase
          .from("productos")
          .select("id_producto, nombre_producto, id_categoria");

        console.log("Respuesta de productos:", productos);

        if (productosError) {
          console.error("Error al obtener productos:", productosError);
          setError(productosError.message);
          return;
        }

        // Agrupamos los productos por categoría
        const categoriasFormateadas = categorias.map((categoria) => {
          // Filtramos los productos que pertenecen a esta categoría
          const productosFiltrados = productos
            ? productos.filter(
                (producto) => producto.id_categoria === categoria.id_categoria
              )
            : [];

          // Obtenemos solo los nombres de los productos
          const nombresProductos = productosFiltrados.map(
            (producto) => producto.nombre_producto
          );

          return {
            id: categoria.id_categoria,
            name: categoria.nombre_categoria,
            items: nombresProductos,
          };
        });

        console.log("Categorías con productos:", categoriasFormateadas);
        setCategories(categoriasFormateadas);
      } catch (error) {
        console.error("Error en la operación:", error);
        setError("Ocurrió un error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriasYProductos();
  }, []);

  const handleDropdownToggle = (category: string) => {
    if (openDropdown === category) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(category);
    }
  };

  return (
    <div>
      {/* Añadir barra de estado de conexión */}
      <div
        className={`text-sm mb-2 p-2 text-center ${
          connectionStatus.includes("✅")
            ? "bg-green-100 text-green-800"
            : connectionStatus.includes("❌")
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {connectionStatus}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          Cargando categorías y productos...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-4 text-red-600">
          Error: {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          No se encontraron categorías
        </div>
      ) : (
        <div className="flex justify-center items-center gap-15 text-lg pt-4 pb-4">
          <a
            href="#mejores-ofertas"
            className="cursor-pointer hover:text-red-600 transition-colors mx-4"
          >
            Ofertas
          </a>
          {categories.map((category) => (
            <div key={category.id} className="relative mx-4">
              <button
                onClick={() => handleDropdownToggle(category.name)}
                className="flex items-center hover:text-red-600 transition-colors"
              >
                {category.name}
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    openDropdown === category.name ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {openDropdown === category.name && (
                <div className="absolute z-50 mt-2 w-64 bg-white rounded-md shadow-lg py-1 text-base max-h-96 overflow-y-auto left-0">
                  {category.items.length > 0 ? (
                    category.items.map((item, index) => (
                      <a
                        key={index}
                        href={`/productname?nombre=${encodeURIComponent(item)}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    ))
                  ) : (
                    <div className="block px-4 py-2 text-gray-500 italic">
                      No hay productos en esta categoría
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categorias;

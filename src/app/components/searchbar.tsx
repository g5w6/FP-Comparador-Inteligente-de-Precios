"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SearchResult {
  id_producto: number;
  nombre_producto: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Realizar búsqueda en tiempo real mientras se escribe
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("id_producto, nombre_producto")
          .ilike("nombre_producto", `%${query}%`)
          .order("nombre_producto")
          .limit(5);

        if (error) {
          console.error("Error al buscar productos:", error);
          return;
        }

        setResults(data || []);
        setShowResults(true);
      } catch (err) {
        console.error("Error inesperado en la búsqueda:", err);
      } finally {
        setIsSearching(false);
      }
    };

    // Usar un temporizador para evitar hacer muchas solicitudes mientras se escribe
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchProducts();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Cerrar resultados al hacer clic fuera de la barra de búsqueda
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  // Manejar clic en un resultado
  const handleResultClick = (productName: string) => {
    router.push(`/productname?nombre=${encodeURIComponent(productName)}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative" ref={searchContainerRef}>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-white sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div
            className="absolute inset-y-0 start-0 flex
            items-center ps-3 pointer-events-none"
          >
            <svg
              className="w-4 h-4 text-white dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-base text-white border-1
            border-white rounded-lg dark:bg-transparent dark:text-white
            focus:outline-none focus:border-2 no-clear-button"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5
            focus:outline-none font-medium rounded-lg text-sm px-4 py-2 hover:text-red-500"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Resultados de búsqueda en tiempo real */}
      {showResults && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-30 max-h-72 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Buscando...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li
                  key={result.id_producto}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 text-gray-800"
                  onClick={() => handleResultClick(result.nombre_producto)}
                >
                  {result.nombre_producto}
                </li>
              ))}
              <li className="p-2 text-center bg-gray-50">
                <button
                  onClick={handleSubmit}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Ver todos los resultados
                </button>
              </li>
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No se encontraron productos
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

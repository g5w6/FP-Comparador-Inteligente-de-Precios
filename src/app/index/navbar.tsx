"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "../components/searchbar";
import { useCart } from "../index/carrito";

const Navbar = () => {
  const { toggleCart, totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Marcar cuando el componente está montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función para abrir/cerrar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-red-600 p-3 sm:p-4 md:p-6 sticky top-0 z-20 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Fila superior en móvil / Izquierda en escritorio */}
        <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto justify-between sm:justify-start">
          {/* Botón de menú hamburguesa (solo visible en móvil y tablets pequeñas) */}
          <button
            className="sm:hidden focus:outline-none mr-2"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <Image
              src="/menu-burger.svg"
              alt="Menú"
              width={24}
              height={24}
              className="text-white"
            />
          </button>

          {/* Logo - adaptable según el tamaño */}
          <Link
            href="/"
            className="text-white text-lg sm:text-xl md:text-2xl font-bold transition-all"
          >
            Precio Justo
          </Link>

          {/* Botón del carrito para móvil */}
          <button
            onClick={toggleCart}
            className="sm:hidden text-white hover:text-gray-200 transition-colors relative"
            aria-label="Ver lista de compras"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7">
              <Image
                src="/list.svg"
                alt="Lista de compras"
                width={24}
                height={24}
                className="text-white"
              />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Barra de búsqueda - adaptable */}
        <div className="w-full sm:w-1/2 lg:w-2/5 mb-3 sm:mb-0 sm:mx-4 md:mx-auto order-3 sm:order-2">
          <SearchBar />
        </div>

        {/* Botón del carrito para tablet/desktop */}
        <div className="hidden sm:flex items-center justify-end sm:w-auto order-2 sm:order-3">
          <button
            onClick={toggleCart}
            className="text-white hover:text-gray-200 transition-colors relative p-1"
            aria-label="Ver lista de compras"
          >
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <Image
                src="/list.svg"
                alt="Lista de compras"
                width={24}
                height={24}
                className="text-white"
              />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Menú móvil - placeholder */}
      {isMounted && isMenuOpen && (
        <div className="sm:hidden mt-2 pt-2 border-t border-red-500">
          <div className="py-2 text-white text-center">
            Menú en construcción
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

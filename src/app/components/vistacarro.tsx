"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "../index/carrito";

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
  } = useCart();

  const cartRef = useRef<HTMLDivElement>(null);

  // Cerrar carrito al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div
        ref={cartRef}
        className="bg-white w-full max-w-md h-full flex flex-col shadow-xl pointer-events-auto"
      >
        <div className="p-4 bg-red-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Mi Lista de Compras ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-600 text-center mb-4">
              Tu lista de compras está vacía
            </p>
            <button
              onClick={closeCart}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.establecimiento}-${index}`}
                  className="border-b border-gray-200 py-4 flex"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xs text-gray-500 text-center p-1">
                      {item.nombre}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.establecimiento}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.cantidad - 1,
                              item.establecimiento
                            )
                          }
                          className="px-2 py-1 border-r border-gray-300"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 min-w-[40px] text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.cantidad + 1,
                              item.establecimiento
                            )
                          }
                          className="px-2 py-1 border-l border-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800 font-medium">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${item.precio.toFixed(2)} c/u
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.establecimiento)}
                      className="text-red-600 text-sm mt-2 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/checkout"
                  className="bg-red-600 text-white py-2 px-4 rounded-md text-center hover:bg-red-700 transition-colors"
                  onClick={closeCart}
                >
                  Proceder al pago
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-600 py-2 hover:text-red-800 text-sm"
                >
                  Vaciar lista
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

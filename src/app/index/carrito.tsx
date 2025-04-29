"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  establecimiento: string;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">, cantidad: number) => void;
  removeItem: (id: number, establecimiento: string) => void;
  updateQuantity: (
    id: number,
    cantidad: number,
    establecimiento: string
  ) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Cargar carrito desde localStorage en el primer renderizado
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error al cargar el carrito guardado:", error);
      }
    }
  }, []);

  // Actualizar localStorage cuando el carrito cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));

    // Calcular totales
    const itemCount = items.reduce((total, item) => total + item.cantidad, 0);
    const price = items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [items]);

  const addItem = (item: Omit<CartItem, "cantidad">, cantidad: number) => {
    setItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.establecimiento === item.establecimiento
      );

      if (existingItemIndex >= 0) {
        // Si existe, actualizar la cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += cantidad;
        return updatedItems;
      } else {
        // Si no existe, agregar como nuevo item
        return [...prevItems, { ...item, cantidad }];
      }
    });
  };

  // Actualizar para usar también el establecimiento
  const removeItem = (id: number, establecimiento: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.establecimiento === establecimiento)
      )
    );
  };

  // Actualizar para usar también el establecimiento
  const updateQuantity = (
    id: number,
    cantidad: number,
    establecimiento: string
  ) => {
    if (cantidad <= 0) {
      removeItem(id, establecimiento);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.establecimiento === establecimiento
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

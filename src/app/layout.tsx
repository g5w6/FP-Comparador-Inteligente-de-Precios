import React from "react";
import Cart from "./components/vistacarro";
import "./globals.css";
import { CartProvider } from "./index/carrito";
import Categorias from "./index/categorias";
import Footer from "./index/footer";
import Header from "./index/header";
import NavBar from "./index/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {/* header */}
          <header className="bg-[#8c0000]">
            <Header />
          </header>

          {/* seccion navbar */}
          <section className="bg-[#eb1414]">
            <NavBar />
          </section>

          {/* seccion de categorias */}
          <section className="bg-withe">
            <Categorias />
          </section>

          {/* Contenido específico de cada página */}
          {children}

          {/* Componente del carrito (se muestra/oculta según el estado) */}
          <Cart />

          <section>
            <Footer />
          </section>
        </CartProvider>
      </body>
    </html>
  );
}

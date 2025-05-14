# Feria de Proyectos Comparador Inteligente de Precios.

## Descripción del Proyecto

Este es un proyecto de e-commerce desarrollado como parte del XVII Concurso de Proyectos de Innovación. La plataforma permite navegar por diferentes categorías de productos, añadirlos a un carrito y poder hacer la comparación de precios entre productos y supermercados.

## Arquitectura

El proyecto sigue una arquitectura fullstack:

- **Frontend**: Desarrollado en React y Tailwind para crear una interfaz de usuario dinámica y responsiva.
- **Backend**: API RESTful desarrollada en Next.js que gestiona la lógica de negocio y el acceso a datos.
- **Base de Datos**: SupaBase para el almacenamiento persistente de datos.
- **Despliegue**: Utilicé el despliegue que proporciona Next.Js.

## Características Principales

- Catálogo de productos con categorías
- Carrito de compras
- Sistema de pagos
- Comparación de productos entre supermercados.

## Requisitos

- Node.js v18.18 o superior
- Next.js v15 o superior
- TailwindCss v4.0.9
- TypeScript v5
- npm, yarn o bun
- fnm como contralador de versiones

“Cuando instalas Next.JS al momento de la instalación te pregunta que dependencias quieres instalar, yo escogí Tailwind y TypeScript y te lo instala automáticamente.”

## Estructura de los files del programa

### Carpeta .next

- La carpeta .next es generada automáticamente por Next.js cuando construyes tu aplicación. Es fundamental para el funcionamiento de tu aplicación en producción y desarrollo:

- Propósito: Almacena el código compilado y optimizado de tu aplicación
  - Contenido:
  - /static: Contiene los archivos estáticos procesados por Next.js, como JavaScript optimizado y CSS
  - /server: Código de componentes server-side renderizados
  - /cache: Archivos temporales para mejorar el rendimiento entre compilaciones
  - build-manifest.json: Manifiesto que mapea las rutas a sus archivos correspondientes
  - routes-manifest.json: Configuración de rutas de la aplicación
  - react-loadable-manifest.json: Usado para la carga dividida (code splitting)

### Carpeta public

- Propósito: Almacena todos los archivos estáticos accesibles directamente desde el navegador
  - Contenido:
  - cart-icon.svg: Icono del carrito de compras
  - facebook.svg: Icono para compartir en Facebook
  - oxc.svg: Logo principal de la aplicación
  - Otras imágenes y recursos estáticos

### Carpeta src

- app
  - Propósito: Contiene la estructura principal de la aplicación (sigue el paradigma de App Router de Next.js)
- components
  - Propósito: Componentes reutilizables en diferentes partes de la aplicación
  - Contenido:
  - carousel.tsx: Implementa el carrusel de imágenes para la página principal
  - sliderproducts.tsx: Muestra productos en un formato de slider horizontal
  - sproduct.tsx: Componente que renderiza un producto individual con su información
  - vistacarro.tsx: Implementa la interfaz visual del carrito de compras
- index
  - Propósito: Componentes específicos para la página principal
  - Contenido:
  - bento.tsx: Implementa el diseño tipo "bento grid" para mostrar categorías populares
  - carrito.tsx: Lógica y gestión del estado del carrito de compras
  - categorias.tsx: Componente para mostrar las distintas categorías de productos
  - footer.tsx: Pie de página con información de contacto y enlaces útiles
- lib
  - Propósito: Utilidades y configuraciones compartidas
  - Contenido:
  - supabaseClient.ts: Configuración y cliente para conectar con la base de datos Supabase
- productname
  - Propósito: Página detallada de productos individuales
  - Contenido:
  - page.tsx: Vista detallada con información completa de producto y comparativa de precios
  - Archivos principales de la app

### layout.tsx: Define la estructura general de la aplicación, incluyendo elementos persistentes como navegación

### page.tsx: Implementa la página principal/home de la aplicación

## Autor

```
Mario Gabriel Gómez Seguame.
Correo instutucional: za210111009@zapopan.tecmm.edu.mx
```

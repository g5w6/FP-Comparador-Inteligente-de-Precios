# Instrucciones de Instalación y Despliegue

Este documento proporciona instrucciones detalladas para instalar y configurar tanto el frontend como el backend del proyecto Comparador Inteligente de Precios.

## Requisitos Previos

Asegúrate de tener instalado:

- Next.js v15 o superior
- TailwindCss v4.0.9
- TypeScript v5
- npm, yarn o bun
- fnm como controlador de versiones
- Supabase

## Instalación Local para Desarrollo

### Configuración del Backend

1. Navegar al directorio en donde quieras crear el proyecto:

   ```bash
   cd <ubicación de tu proyecto>
   ```

2. Verificar que ya tengas instalada o instalar:
   Instalar Node.js, npm y fnm como controlador de versiones
   Instrucciones de instalación de fnm: https://github.com/Schniz/fnm

   ```bash
   # Download and install fnm:
   winget install Schniz.fnm
   ```

# Download and install Node.js:

fnm install 22

# Verify the Node.js version:

node -v # Should print "v22.15.0".

# Verify npm version:

npm -v # Should print "10.9.2".

## Crear proyecto con Next.js

```bash
npx create-next-app@latest my-next-app
```

al utilizar ese comando se iniciará la creación de tu proyecto, y en ahí mismo podrás instalas dependencias como tailwindcss y typescript.

Para instalar supabase directamente en el proyecto.

```bash
npm install @supabase/supabase-js
```

3. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto que configures).

**De esta manera se despliega todo el proyecto, frontend y backend**

## Solución de Problemas

Si encuentras algún problema durante la instalación, consulta estos tips:

- Verifica la versión de Node.js.
- Verifica la conexión a la base de datos.

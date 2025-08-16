# Telegram Bot para Gestión de Inventario y Pedidos

Este es un bot de Telegram diseñado para gestionar productos, clientes, materiales y pedidos de un negocio. El bot interactúa con una base de datos a través de Prisma para realizar operaciones CRUD.

## ✨ Features

*   **Gestión de Productos:** Añadir, eliminar, ver y actualizar productos.
*   **Gestión de Clientes:** Registrar nuevos clientes y ver la lista de clientes existentes.
*   **Gestión de Materiales:** Controlar el inventario de materiales.
*   **Carrito de Compras:** Añadir productos a un carrito de compras para cada cliente.
*   **Gestión de Pedidos:** Crear pedidos a partir del carrito de compras.
*   **Whitelist:** Solo los usuarios autorizados pueden interactuar con el bot.

## 📂 Estructura del Proyecto

```
.
├── .env
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── commands/
│   ├── ayuda.js
│   ├── carrito.js
│   ├── clientes.js
│   ├── materiales.js
│   └── productos.js
├── prisma/
│   ├── client.js
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── services/
│   ├── carritoService.js
│   ├── clientesService.js
│   ├── materialesService.js
│   └── productosService.js
└── utils/
    └── whitelist.js
```

### Descripción de Archivos y Directorios

*   `app.js`: El punto de entrada de la aplicación. Inicializa el bot de Telegraf, configura los comandos y el middleware.
*   `package.json`: Define los metadatos del proyecto, las dependencias y los scripts.
*   `.env`: Archivo para almacenar variables de entorno, como el token del bot de Telegram y la URL de la base de datos.
*   `prisma/schema.prisma`: Define el esquema de la base de datos y los modelos de datos.
*   `prisma/migrations/`: Contiene las migraciones de la base de datos generadas por Prisma.
*   `commands/`: Contiene los módulos para cada comando del bot.
    *   `ayuda.js`: Muestra la lista de comandos disponibles.
    *   `productos.js`: Gestiona los comandos relacionados con los productos.
    *   `clientes.js`: Gestiona los comandos relacionados con los clientes.
    *   `materiales.js`: Gestiona los comandos relacionados con los materiales.
    *   `carrito.js`: Gestiona los comandos relacionados con el carrito de compras.
*   `services/`: Contiene la lógica de negocio para interactuar con la base de datos.
*   `utils/whitelist.js`: Gestiona la lista de usuarios autorizados para usar el bot.

## 🚀 Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd telegram
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
    ```
    TELEGRAM_BOT_TOKEN="TU_TELEGRAM_BOT_TOKEN"
    DATABASE_URL="mysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BASE_DE_DATOS"
    ```

4.  **Configurar la whitelist:**
    Añade tu Telegram User ID al array `whitelist` en `utils/whitelist.js`.

5.  **Aplicar las migraciones de la base de datos:**
    ```bash
    npx prisma migrate dev --name init
    ```

## ▶️ Uso

Para iniciar el bot, ejecuta uno de los siguientes comandos:

*   **Modo de producción:**
    ```bash
    npm start
    ```

*   **Modo de desarrollo (con reinicio automático):**
    ```bash
    npm run dev
    ```

### Comandos del Bot

*   `/start`: Inicia la conversación con el bot.
*   `/ayuda`: Muestra la lista de comandos disponibles.
*   `/productos`: Muestra los subcomandos para gestionar productos.
*   `/clientes`: Muestra los subcomandos para gestionar clientes.
*   `/materiales`: Muestra los subcomandos para gestionar materiales.
*   `/carrito`: Muestra los subcomandos para gestionar el carrito de compras.

## 📦 Dependencias

### Producción

*   `@prisma/client`: Cliente de Prisma para interactuar con la base de datos.
*   `prisma`: ORM de Prisma para Node.js y TypeScript.
*   `telegraf`: Framework para crear bots de Telegram.

### Desarrollo

*   `nodemon`: Herramienta que reinicia automáticamente la aplicación cuando detecta cambios en los archivos.

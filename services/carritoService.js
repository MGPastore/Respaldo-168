import prisma from '../prisma/client.js';

// Obtener o crear carrito
export const obtenerCarrito = async (clienteId) => {
  let carrito = await prisma.carrito.findUnique({
    where: { clienteId },
  });

  if (!carrito) {
    carrito = await prisma.carrito.create({
      data: {
        clienteId,
        items: { items: [] },
      },
    });
  }

  // Normalizar items
  if (!carrito.items || !carrito.items.items) {
    if (carrito.items && Array.isArray(carrito.items)) {
      carrito.items = { items: carrito.items };
    } else {
      carrito.items = { items: [] };
    }
  }

  return carrito;
};

// Agregar producto al carrito
export const agregarAlCarrito = async (clienteId, productoId, cantidad, nombre, precio) => {
  const carrito = await obtenerCarrito(clienteId);
  const items = carrito.items.items || [];
  const index = items.findIndex(item => item.productoId === productoId);

  if (index > -1) {
    items[index].cantidad += cantidad;
  } else {
    items.push({ productoId, cantidad, nombre, precio });
  }

  return prisma.carrito.update({
    where: { clienteId },
    data: { items: { items } },
  });
};

// Vaciar carrito
export const limpiarCarrito = async (clienteId) => {
  return prisma.carrito.update({
    where: { clienteId },
    data: { items: { items: [] } },
  });
};

// Crear pedido desde carrito
export const crearPedidoDesdeCarrito = async (clienteId, productos) => {
  if (!productos || productos.length === 0) {
    throw new Error('El carrito está vacío');
  }

  const total = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const pedido = await prisma.pedido.create({
    data: {
      clienteId,
      total,
      productos: {
        create: productos.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
      },
    },
    include: {
      productos: { include: { producto: true } },
    },
  });

  return pedido;
};

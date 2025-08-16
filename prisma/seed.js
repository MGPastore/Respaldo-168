import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Limpiar la base de datos
  await prisma.pedidoProducto.deleteMany({});
  await prisma.pedido.deleteMany({});
  await prisma.carrito.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.material.deleteMany({});

  // 2. Crear Productos
  await prisma.producto.createMany({
    data: [
      { nombre: 'Pizza Margarita', precio: 10.99, stock: 50 },
      { nombre: 'Pizza Pepperoni', precio: 12.99, stock: 40 },
      { nombre: 'Pizza Vegetariana', precio: 11.99, stock: 30 },
      { nombre: 'Pizza Hawaiana', precio: 13.99, stock: 20 },
      { nombre: 'Pizza BBQ', precio: 14.99, stock: 25 },
      { nombre: 'Refresco', precio: 1.99, stock: 100 },
      { nombre: 'Postre', precio: 4.99, stock: 60 },
    ],
  });
  const productos = await prisma.producto.findMany();

  // 3. Crear Materiales
  await prisma.material.createMany({
    data: [
      { nombre: 'Harina', cantidad: 50, unidad: 'kg' },
      { nombre: 'Queso Mozzarella', cantidad: 20, unidad: 'kg' },
      { nombre: 'Salsa de Tomate', cantidad: 30, unidad: 'litros' },
      { nombre: 'Pepperoni', cantidad: 10, unidad: 'kg' },
    ],
  });

  // 4. Crear Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: 'Juan Perez',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: 'Ana Gomez',
      telefono: '987654321',
      direccion: 'Avenida Siempreviva 742',
    },
  });

  // 5. Crear un Carrito para Juan Perez
  await prisma.carrito.create({
    data: {
      clienteId: cliente1.id,
      items: {
        items: [
          { productoId: productos[0].id, cantidad: 2, nombre: productos[0].nombre, precio: productos[0].precio }, // 2 Pizzas Margarita
          { productoId: productos[5].id, cantidad: 4, nombre: productos[5].nombre, precio: productos[5].precio }, // 4 Refrescos
        ],
      },
    },
  });

  // 6. Crear un Pedido para Ana Gomez
  const pedidoAna = await prisma.pedido.create({
    data: {
      clienteId: cliente2.id,
      total: (productos[1].precio * 1) + (productos[6].precio * 2), // 1 Pepperoni + 2 Postres
      productos: {
        create: [
          { productoId: productos[1].id, cantidad: 1 },
          { productoId: productos[6].id, cantidad: 2 },
        ],
      },
    },
  });

  console.log('Base de datos poblada con datos de prueba.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

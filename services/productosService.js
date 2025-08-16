import prisma from '../prisma/client.js';

export const obtenerProductos = async () => {
  try {
    return await prisma.producto.findMany();
  } catch (error) {
    console.error('Error en obtenerProductos:', error);
    return [];
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    return await prisma.producto.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error);
    return null;
  }
};

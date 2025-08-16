import prisma from '../prisma/client.js';

export const obtenerMateriales = async () => {
  return await prisma.material.findMany();
};
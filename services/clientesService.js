import prisma from '../prisma/client.js';

export const obtenerClientes = async () => {
    return await prisma.cliente.findMany();
};

export const obtenerClientePorId = async (id) => {
    return await prisma.cliente.findUnique({ where: { id: Number(id) } });
};

export const obtenerClientePorTelefono = async (telefono) => {
    return await prisma.cliente.findUnique({
        where: { telefono },
    });
};

export const crearCliente = async (nombre, telefono) => {
    return await prisma.cliente.create({
        data: { nombre, telefono },
    });
};

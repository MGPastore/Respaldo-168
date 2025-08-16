import {
  obtenerClientes
} from '../services/clientesService.js';

export default (bot) => {
  bot.command('clientes', async (ctx) => {
    try {
      const clientes = await obtenerClientes();
      if (clientes.length > 0) {
        let mensaje = 'Lista de clientes registrados 👥:\n';
        clientes.forEach((cliente) => {
          mensaje += `\n- *${cliente.nombre}* - Teléfono: ${cliente.telefono}`;
        });
        ctx.replyWithMarkdown(mensaje);
      } else {
        ctx.reply('No hay clientes registrados.');
      }
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      ctx.reply('Hubo un error al obtener los clientes.');
    }
  });
};

import { obtenerMateriales } from '../services/materialesService.js';

export default (bot) => {
  bot.command('materiales', async (ctx) => {
    try {
      const materiales = await obtenerMateriales();
      if (materiales.length > 0) {
        let mensaje = 'Lista de materiales disponibles 🧱:\n';
        materiales.forEach((material) => {
          mensaje += `\n- *${material.nombre}* - Cantidad: ${material.cantidad} ${material.unidad}`;
        });
        ctx.replyWithMarkdown(mensaje);
      } else {
        ctx.reply('No hay materiales disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error al obtener los materiales:', error);
      ctx.reply('Hubo un error al obtener los materiales.');
    }
  });
};

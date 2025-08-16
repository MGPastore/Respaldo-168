import { obtenerProductos } from '../services/productosService.js';

export default (bot) => {
  bot.command('productos', async (ctx) => {
    try {
      const productos = await obtenerProductos();

      if (productos.length > 0) {
        let mensaje = 'Lista de productos disponibles 🛍️:\n\n';

        productos.forEach((producto) => {
          // Comando clickeable: /carrito_ID
          mensaje += `- ${producto.nombre} - $${producto.precio.toFixed(2)} (Stock: ${producto.stock})\n`;
          mensaje += `/carrito_${producto.id}\n\n`;
        });

        // Enviamos un solo mensaje con todos los productos
        ctx.reply(mensaje);
      } else {
        ctx.reply('No hay productos disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      ctx.reply('Hubo un error al obtener los productos.');
    }
  });
};

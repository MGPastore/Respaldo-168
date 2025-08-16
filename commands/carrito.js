import {
  obtenerCarrito,
  agregarAlCarrito,
  limpiarCarrito,
  crearPedidoDesdeCarrito
} from '../services/carritoService.js';
import {
  obtenerClientePorTelefono,
  crearCliente,
  obtenerClientePorId
} from '../services/clientesService.js';
import { obtenerProductoPorId } from '../services/productosService.js';

export default (bot) => {

  // Middleware para obtener o crear cliente
  const findOrCreateClient = async (ctx, next) => {
    const telegramId = String(ctx.from.id);
    let cliente = await obtenerClientePorTelefono(telegramId);

    if (!cliente) {
      cliente = await crearCliente(ctx.from.first_name, telegramId);
    }

    ctx.state.cliente = cliente;
    return next();
  };

  // Ver carrito
  bot.command('carrito', findOrCreateClient, async (ctx) => {
    try {
      const clienteId = ctx.state.cliente.id;
      const carrito = await obtenerCarrito(clienteId);
      const items = carrito.items.items || [];

      if (items.length === 0) return ctx.reply('Tu carrito está vacío.');

      let mensaje = '🛒 Tu carrito:\n';
      let total = 0;

      items.forEach(item => {
        mensaje += `\n- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}`;
        total += item.precio * item.cantidad;
      });

      mensaje += `\n\n*Total: $${total.toFixed(2)}*`;
      ctx.replyWithMarkdown(mensaje);
    } catch (error) {
      console.error(error);
      ctx.reply('Error al obtener el carrito.');
    }
  });

  // Agregar producto al carrito usando /carrito_ID
  bot.hears(/\/carrito_(\d+)/, findOrCreateClient, async (ctx) => {
    try {
      const productoId = parseInt(ctx.match[1], 10);
      const clienteId = ctx.state.cliente.id;
      const producto = await obtenerProductoPorId(productoId);

      if (!producto) return ctx.reply('Producto no encontrado.');

      await agregarAlCarrito(clienteId, producto.id, 1, producto.nombre, producto.precio);
      ctx.reply(`✅ "${producto.nombre}" agregado al carrito.`);
    } catch (error) {
      console.error(error);
      ctx.reply('Error al agregar producto.');
    }
  });

  // Vaciar carrito
  bot.command('carrito_vaciar', findOrCreateClient, async (ctx) => {
    try {
      const clienteId = ctx.state.cliente.id;
      await limpiarCarrito(clienteId);
      ctx.reply('🗑️ Carrito vaciado correctamente.');
    } catch (error) {
      console.error(error);
      ctx.reply('Error al vaciar el carrito.');
    }
  });

  // Crear pedido del cliente actual
  bot.command('pedido', findOrCreateClient, async (ctx) => {
    try {
      const clienteId = ctx.state.cliente.id;
      const carrito = await obtenerCarrito(clienteId);
      const pedido = await crearPedidoDesdeCarrito(clienteId, carrito.items.items);

      let mensaje = `✅ Pedido #${pedido.id} creado!\nTotal: $${pedido.total.toFixed(2)}\nProductos:`;
      pedido.productos.forEach(p => {
        mensaje += `\n- ${p.cantidad} x ${p.producto.nombre}`;
      });

      await limpiarCarrito(clienteId); // Limpiar carrito

      ctx.reply(mensaje);
    } catch (error) {
      console.error(error);
      ctx.reply(`No se pudo crear el pedido: ${error.message}`);
    }
  });

  // Crear pedido para cliente específico usando /pedido_ID
  bot.hears(/\/pedido_(\d+)/, findOrCreateClient, async (ctx) => {
    try {
      const clienteIdDestino = parseInt(ctx.match[1], 10);
      const clienteDestino = await obtenerClientePorId(clienteIdDestino);
      if (!clienteDestino) return ctx.reply(`❌ No se encontró el cliente con ID ${clienteIdDestino}`);

      const clienteActualId = ctx.state.cliente.id;
      const carrito = await obtenerCarrito(clienteActualId);
      const productos = carrito.items.items || [];

      if (productos.length === 0) return ctx.reply('Tu carrito está vacío. No se puede crear el pedido.');

      const pedido = await crearPedidoDesdeCarrito(clienteIdDestino, productos);

      let mensaje = `✅ Pedido #${pedido.id} creado para cliente ID ${clienteIdDestino}!\nTotal: $${pedido.total.toFixed(2)}\nProductos:`;
      pedido.productos.forEach(p => {
        mensaje += `\n- ${p.cantidad} x ${p.producto.nombre}`;
      });

      await limpiarCarrito(clienteActualId); // Limpiar carrito del cliente actual

      ctx.reply(mensaje);

    } catch (error) {
      console.error(error);
      ctx.reply(`No se pudo crear el pedido: ${error.message}`);
    }
  });

};

export default (bot) => {
  bot.command('ayuda', (ctx) => {
    const msg = `
📌 *Comandos disponibles:*

/productos — Lista productos disponibles.
/clientes — Lista clientes.
/materiales — Lista materiales.

/carrito — Ver tu carrito actual.
/carrito\\_ID — Agregar producto al carrito (reemplaza ID con el ID del producto).
/carrito\\_vaciar — Vaciar tu carrito actual.
/pedido — Crear un pedido con los productos del carrito.
/pedido\\_ID — Crear un pedido para un cliente específico (reemplaza ID con el ID del cliente).

/buscar <texto> — Buscar en productos, clientes o materiales.
/ayuda — Mostrar esta lista de comandos.
    `;
    ctx.replyWithMarkdown(msg);
  });
};

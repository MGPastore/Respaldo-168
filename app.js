import { Telegraf } from "telegraf";
import productosCommand from "./commands/productos.js";
import carritoCommand from "./commands/carrito.js";
import clientesCommand from "./commands/clientes.js";
import materialesCommand from "./commands/materiales.js";
import ayudaCommand from "./commands/ayuda.js";
import { isAuthorized } from "./utils/whitelist.js";

import App from "./Express_chat/app.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware whitelist con User ID incluido
bot.use((ctx, next) => {
  if (!isAuthorized(ctx.from.id)) {
    return ctx.reply(
      `🚫 No autorizado.\nTu Telegram User ID es: ${ctx.from.id}\nAgregalo a la whitelist para usar el bot.`
    );
  }
  return next();
});

// Comandos
bot.start(ctx => ctx.reply("👋 Bienvenido. Usa /ayuda para ver comandos."));
ayudaCommand(bot);
productosCommand(bot);
carritoCommand(bot);
clientesCommand(bot);
materialesCommand(bot);


// Iniciar bot
const app = new App(bot);
app.start();
//bot.launch();

console.log("🤖 Bot iniciado...");

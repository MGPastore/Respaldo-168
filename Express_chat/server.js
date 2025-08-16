import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Telegraf } from 'telegraf';

// --- Config ---
const PORT = process.env.PORT || 3001;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error('Falta TELEGRAM_BOT_TOKEN en .env');

// Parseo de whitelist a array de números
const WHITELIST = (process.env.WHITELIST || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(v => Number(v))
  .filter(v => Number.isFinite(v));

// --- App/Server/IO ---
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' }
});

// Sirve archivos estáticos (HTML/CSS/JS del dashboard)
app.use(express.static('public'));

// (Opcional) protección ultra simple por query param ?pass=...
app.use((req, res, next) => {
  const needPass = (process.env.DASHBOARD_PASS || '').length > 0;
  if (!needPass) return next();
  if (req.path.startsWith('/socket.io/')) return next(); // permitir canal de sockets
  if (req.path === '/' || req.path.endsWith('.html')) {
    // si viene con pass OK, setea cookie de sesión simple
    const pass = req.query.pass;
    if (pass === process.env.DASHBOARD_PASS) return next();
    return res.status(401).send('<h3>401 - No autorizado</h3><p>Agrega ?pass=TU_PASS en la URL</p>');
  }
  next();
});

// --- Telegraf (Bot) ---
const bot = new Telegraf(TOKEN);

// Escucha textos entrantes del bot para mostrarlos en el dashboard
bot.on('text', async (ctx) => {
  const payload = {
    fromId: ctx.from?.id,
    fromName: `${ctx.from?.first_name || ''} ${ctx.from?.last_name || ''}`.trim(),
    chatId: ctx.chat?.id,
    text: ctx.message?.text || '',
    date: new Date((ctx.message?.date || 0) * 1000).toISOString()
  };
  io.emit('incoming-message', payload);
});

// Comando simple para probar que el dashboard está conectado
bot.command('ping', (ctx) => ctx.reply('pong'));

// Lanza el bot (long polling)
bot.launch().then(() => console.log('Telegraf: bot lanzado.'));

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log('Dashboard conectado:', socket.id);

  // Enviar whitelist actual al cliente
  socket.emit('whitelist', WHITELIST);

  // Enviar a un usuario específico
  socket.on('send-to-one', async ({ chatId, text }) => {
    try {
      if (!chatId || !text) return socket.emit('op-result', { ok: false, msg: 'Faltan datos' });
      await bot.telegram.sendMessage(chatId, text);
      socket.emit('op-result', { ok: true, msg: `Enviado a ${chatId}` });
    } catch (err) {
      console.error('[send-to-one]', err);
      socket.emit('op-result', { ok: false, msg: 'Error 505' }); // genérico para UI
    }
  });

  // Enviar a toda la whitelist
  socket.on('send-to-all', async ({ text }) => {
    if (!text) return socket.emit('op-result', { ok: false, msg: 'Falta el texto' });
    const results = [];
    for (const id of WHITELIST) {
      try {
        await bot.telegram.sendMessage(id, text);
        results.push({ id, ok: true });
      } catch (err) {
        console.error('[send-to-all]', id, err);
        results.push({ id, ok: false });
      }
    }
    socket.emit('bulk-result', results);
  });

  // Probar conexión con el bot
  socket.on('bot-ping', async () => {
    try {
      // no enviamos a Telegram; solo confirmamos que el proceso está vivo
      socket.emit('op-result', { ok: true, msg: 'Bot OK' });
    } catch (err) {
      console.error('[bot-ping]', err);
      socket.emit('op-result', { ok: false, msg: 'Error 505' });
    }
  });
});

// --- Inicio ---
server.listen(PORT, () => {
  console.log(`Dashboard local escuchando en http://localhost:${PORT}`);
});

// Shutdown limpio
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
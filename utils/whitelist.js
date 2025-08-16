// utils/whitelist.js
const telegramIds = process.env.TELEGRAM_IDS
  .split(',')          // separa por comas
  .map(id => parseInt(id.trim())); // convierte a número y elimina espacios

//export const WHITELIST = [8215303093]; // tu ID de Telegram
export const WHITELIST = telegramIds // tu ID de Telegram


export function isAuthorized(userId) {
  return WHITELIST.includes(userId);
}

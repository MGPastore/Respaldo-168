const socket = io();

const chatIdInput = document.getElementById('chatId');
const msgOne = document.getElementById('msgOne');
const msgAll = document.getElementById('msgAll');
const sendOneBtn = document.getElementById('sendOne');
const sendAllBtn = document.getElementById('sendAll');
const whitelistBox = document.getElementById('whitelistBox');
const incomingList = document.getElementById('incoming');
const pingBtn = document.getElementById('pingBtn');

sendOneBtn.addEventListener('click', () => {
  const chatId = Number(chatIdInput.value);
  const text = msgOne.value.trim();
  if (!chatId || !text) return alert('Faltan chat_id o mensaje');
  socket.emit('send-to-one', { chatId, text });
});

sendAllBtn.addEventListener('click', () => {
  const text = msgAll.value.trim();
  if (!text) return alert('Escribe un mensaje');
  socket.emit('send-to-all', { text });
});

pingBtn.addEventListener('click', () => {
  socket.emit('bot-ping');
});

socket.on('op-result', (data) => {
  // Mensaje corto arriba a la derecha (toast simple)
  console.log('op-result', data);
  alert(data.msg || (data.ok ? 'OK' : 'Error 505'));
});

socket.on('bulk-result', (results) => {
  const ok = results.filter(r => r.ok).length;
  const total = results.length;
  alert(`Enviados: ${ok}/${total}`);
});

socket.on('whitelist', (ids) => {
  whitelistBox.textContent = `Whitelist: ${ids.join(', ')}`;
});

socket.on('incoming-message', (m) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${m.fromName || 'Usuario'}</strong> <small>(id:${m.fromId})</small><br>${escapeHTML(m.text)}<br><small>${new Date(m.date).toLocaleString()}</small>`;
  incomingList.prepend(li);
});

function escapeHTML (str) {
  return str.replace(/[&<>"]+/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
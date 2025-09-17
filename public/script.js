const socket = io('https://chaty-tx32.onrender.com/');
const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');

// Load chat history
socket.on('chatHistory', (msgs) => {
  msgs.forEach(m => addMessage(m.text));
});

// Receive new message
socket.on('receiveMessage', (msg) => {
  addMessage(msg.text);
});

function sendMessage() {
  const text = msgInput.value;
  if (!text) return;
  socket.emit('sendMessage', text);
  msgInput.value = '';
}

function addMessage(text) {
  const p = document.createElement('p');
  p.innerText = text;
  messagesDiv.appendChild(p);
}
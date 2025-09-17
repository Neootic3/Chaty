// Update this with your Render URL after deployment
const socket = io('https://chaty-tx32.onrender.com/'); // Replace with Render URL in production

const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');

// Load chat history
socket.on('chatHistory', (msgs) => {
  msgs.forEach(m => addMessage(m.text));
});

// Receive new messages
socket.on('receiveMessage', (msg) => {
  addMessage(msg.text);
});

function sendMessage() {
  const text = msgInput.value;
  if (!text) return;
  socket.emit('sendMessage', text);
  msgInput.value = '';
}

// Send message on Enter key
msgInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

// Add message to chat and auto-scroll
function addMessage(text) {
  const p = document.createElement('p');
  p.innerText = text;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
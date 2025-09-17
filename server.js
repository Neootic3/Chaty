const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Datastore = require('nedb');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// Database
const db = new Datastore({ filename: 'messages.db', autoload: true });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Socket.IO
io.on('connection', socket => {
  console.log('New user connected');

  // Send chat history
  db.find({}).sort({ createdAt: 1 }).exec((err, docs) => {
    socket.emit('chatHistory', docs);
  });

  // Receive message
  socket.on('sendMessage', (msg) => {
    const message = { text: msg, createdAt: new Date() };
    db.insert(message, () => {
      io.emit('receiveMessage', message);
    });
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
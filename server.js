const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');  // Make sure this line is present!

const app = express();
const server = http.createServer(app);
const io = socketIO(server);   // You must declare 'io' like this

app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('user joined', (username) => {
    users[socket.id] = username;
    io.emit('user joined', username);
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('user left', username);
      delete users[socket.id];
    }
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

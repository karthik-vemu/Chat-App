const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const username = prompt("Enter your username:");
socket.emit('user joined', username);
document.getElementById('user-display').textContent = username;

// Send message when form is submitted
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', {
      username: username,
      message: input.value
    });
    input.value = '';
  }
});

// Receive and display chat messages
socket.on('chat message', function (data) {
  const item = document.createElement('li');
  const messageClass = data.username === username ? 'me' : 'other';
  item.classList.add(messageClass);

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  item.innerHTML = `<strong>${data.username}</strong><br>${data.message}<div class="meta">${time}</div>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Notify when a user joins
socket.on('user joined', function (user) {
  const item = document.createElement('li');
  item.textContent = `${user} joined the chat`;
  item.style.textAlign = 'center';
  item.style.fontStyle = 'italic';
  item.style.fontSize = '0.9em';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Notify when a user leaves
socket.on('user left', function (user) {
  const item = document.createElement('li');
  item.textContent = `${user} left the chat`;
  item.style.textAlign = 'center';
  item.style.fontStyle = 'italic';
  item.style.fontSize = '0.9em';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

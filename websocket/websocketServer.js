const WebSocket = require('ws');
const { handleUserLogin, handleUserLogout } = require('./userManager');

const port = process.env.WEBSOCKET_PORT || 8080;
const wss = new WebSocket.Server({ port });

console.log(`Hello from WebSocket server on ws://localhost:${port}`);

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'login':
          handleUserLogin(wss, ws, message.username, message.role);
          break;
        case 'logout':
          handleUserLogout(wss, ws);
          break;
        default:
          console.error('unknown message type:', message.type);
      }
    } catch (error) {
      console.error('invalid message format:', data);
    }
  });

  ws.on('close', () => {
    handleUserLogout(wss, ws);
    console.log('Client disconnected');
  });
});

const { v4: uuidv4 } = require('uuid'); 


const activeUsers = [];
const generateUniqueId = () => uuidv4(); 

const handleUserLogin = (wss, ws, username, role) => {
  const existingUser = activeUsers.find((user) => user.username === username);

  if (existingUser) {
    existingUser.id = ws.userId;
  } else {
    const userId = generateUniqueId(); 
    ws.userId = userId;
    activeUsers.push({ id: userId, username, role });
  }

  broadcast(wss, {
    type: "activeUsers",
    users: activeUsers,
  });
};

const handleUserLogout = (wss, ws) => {
  const index = activeUsers.findIndex((user) => user.id === ws.userId);

  if (index !== -1) {
    activeUsers.splice(index, 1);

    broadcast(wss, {
      type: 'activeUsers',
      users: activeUsers,
    });
  }
};

const getActiveUsers = () => [...activeUsers];

const broadcast = (wss, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = {
  handleUserLogin,
  handleUserLogout,
  getActiveUsers,
};

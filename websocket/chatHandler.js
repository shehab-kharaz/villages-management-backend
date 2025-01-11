const { getActiveUsers } = require('./userManager');
const WebSocket = require('ws');

let chatHistory = [];

const handleChat = (wss, message) => {
  try {
    const { from, to, message: msg } = message;

    if (!to) {
      console.error('Recipient is undefined.');
      return;
    }

    const chatMessage = {
      from: from,
      to: to,
      message: msg,
      timestamp: new Date(),
    };
    chatHistory.push(chatMessage);

    const recipient = [...wss.clients].find(
      (client) => client.userId && getActiveUsers().find((u) => u.id === client.userId && u.username === to)
    );

    if (recipient && recipient.readyState === WebSocket.OPEN) {
      recipient.send(
        JSON.stringify({
          type: 'chat',
          from: from,
          text: msg 
        })
      );
    }
  } catch (err) {
    console.error('Error in handleChat:', err);
  }
};


const handleFetchHistory = (ws, message) => {
  try {
    const userMessages = chatHistory.filter(msg => msg.from === message.username || msg.to === message.username);
    ws.send(
      JSON.stringify({
        type: 'history',
        messages: userMessages
      })
    );
  } catch (err) {
    console.error('Error in handleFetchHistory:', err);
  }
};

module.exports = {
  handleChat,
  handleFetchHistory
};

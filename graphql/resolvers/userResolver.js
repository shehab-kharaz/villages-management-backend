const { readDataFromFile, writeDataToFile } = require('../services/fileService');
const resolvers = {
  Mutation: {
    signup: async (_, { fullName, username, password }) => {  
      if (!fullName || !username || !password) {
        throw new Error('Full name, username, and password are required.');
      }

      let users = [];
      try {
        users = await readDataFromFile('USERS'); 
      } catch (err) {
        if (err.message.includes('ENOENT')) {
          users = [];
        } else {
          throw new Error('Cannot read file') 
        }
      }

      if (users.some(user => user.username === username)) {
        throw new Error('Username is already taken.');
      }

      const newUser = { fullName, username, password };
      users.push(newUser);

      try {
        await writeDataToFile('USERS', users);  
      } catch (writeError) {
        throw new Error('Error saving user data.');
      }

      return newUser;
    },
  },
};


module.exports = resolvers;

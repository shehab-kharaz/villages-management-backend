const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readDataFromFile, writeDataToFile } = require('../services/fileService');

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY 
const tokenBlacklist = new Set(); 

async function getUsersFromFile() {
  try {
    return await readDataFromFile('USERS');
  } catch (err) {
    if (err.message.includes('ENOENT')) return []; 
    throw new Error('Error reading user data from file');
  }
}

async function saveUsersToFile(users) {
  try {
    await writeDataToFile('USERS', users);
  } catch (err) {
    throw new Error('Error saving user data to file');
  }
}

const resolvers = {
  Mutation: {
    signup: async (_, { fullName, username, password }) => {
      if (!fullName || !username || !password) {
        throw new Error('Full name, username, and password are required.');
      }

      let users = await getUsersFromFile();

      if (users.some(user => user.username === username)) {
        throw new Error('Username is already taken.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { fullName, username, password: hashedPassword, role: 'user' };

      users.push(newUser);

      await saveUsersToFile(users);

      return { fullName, username, role: 'user', password: null };
    },

    login: async (_, { username, password }) => {
      let users = await getUsersFromFile();

      const user = users.find(user => user.username === username);
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid username or password.');
      }

      const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: TOKEN_EXPIRY }
      );

      return { token, user: { fullName: user.fullName, username: user.username, role: user.role, password: null } };
    },

    logout: async (_, __, { req }) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Token not provided.');
      }
    
      tokenBlacklist.add(token); 
      return true;
    },
       
  },
};

module.exports = resolvers;

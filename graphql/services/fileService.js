const fs = require('fs').promises; 
const path = require('path');

const FilePaths = {
  USERS: 'data/users.json',
  VILLAGES: 'data/villages.json',
};

const readDataFromFile = async (fileKey) => {
  const filePath = path.join(__dirname, `../../${FilePaths[fileKey]}`);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);  
  } catch (error) {
    throw new Error(`Error reading data from file: ${filePath} - ${error.message}`);
  }
};

const writeDataToFile = async (fileKey, data) => {
  const filePath = path.join(__dirname, `../../${FilePaths[fileKey]}`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Error writing data to file: ${filePath} - ${error.message}`);
  }
};

module.exports = { 
  readDataFromFile, 
  writeDataToFile, 
};

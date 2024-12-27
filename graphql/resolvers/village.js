const fs = require('fs');
const path = require('path');

const villagesPath = path.join(__dirname, '../../data/villages.json');

const readDataFromFile = () => {
  try {
    return JSON.parse(fs.readFileSync(villagesPath, 'utf-8'));
  } catch (error) {
    throw new Error('Error reading data from file');
  }
};

const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(villagesPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error('Error writing data to file');
  }
};

module.exports = {
  getVillages: () => {
    const data = readDataFromFile();
    return data;
  },

  getVillage: (parent, args) => {
    const data = readDataFromFile();
    return data.find(village => village.name === args.name);
  },

  addVillage: (parent, args) => {
    const data = readDataFromFile();
    data.push(args.village);
    writeDataToFile(data);
    return args.village;
  },

  updateVillage: (parent, args) => {
    const data = readDataFromFile();
    const index = data.findIndex(v => v.name === args.name);
    if (index !== -1) {
      data[index] = { ...data[index], ...args.village };
      writeDataToFile(data);
      return data[index];
    }
    return null;
  },

  deleteVillage: (parent, args) => {
    const data = readDataFromFile();
    const updatedData = data.filter(village => village.name !== args.name);
    writeDataToFile(updatedData);
    return { name: args.name };
  }
};

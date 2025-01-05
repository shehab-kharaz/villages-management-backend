const { readDataFromFile, writeDataToFile } = require('../services/fileService');
const calculateStatistics = require('../services/statisticsService');

module.exports = {
  Query: {
    villages: async () => {
      return await readDataFromFile('VILLAGES');
    },

    village: async (_, { name }) => {
      const data = await readDataFromFile('VILLAGES');
      return data.find(village => village.name === name);
    },

    statistics: async () => {
      const data = await readDataFromFile('VILLAGES');
      return calculateStatistics(data);
    },
  },

  Mutation: {
    addVillage: async (_, { village }) => {
      const data = await readDataFromFile('VILLAGES');
      data.push(village);
      await writeDataToFile('VILLAGES', data);
      return village;
    },

    updateVillage: async (_, { name, village }) => {
      const data = await readDataFromFile('VILLAGES');
      const index = data.findIndex(v => v.name === name);
      if (index !== -1) {
        data[index] = { ...data[index], ...village };
        await writeDataToFile('VILLAGES', data);
        return data[index];
      }
      throw new Error(`Village with name ${name} not found`);
    },

    deleteVillage: async (_, { name }) => {
      const data = await readDataFromFile('VILLAGES');
      const updatedData = data.filter(village => village.name !== name);
      if (updatedData.length === data.length) {
        throw new Error(`Village with name ${name} not found`);
      }
      await writeDataToFile('VILLAGES', updatedData);
      return { name };
    },

    updateVillageDemographic: async (_, { name, village }) => {
      const data = await readDataFromFile('VILLAGES');
      const index = data.findIndex(v => v.name === name);
      if (index === -1) {
        throw new Error(`Village with name ${name} not found`);
      }

      const updatedVillage = {
        ...data[index],
        demographic: {
          ...data[index].demographic,
          ...village.demographic, 
        },
      };
      
      data[index] = updatedVillage;
      await writeDataToFile('VILLAGES', data);

      return updatedVillage;
    },
  },
};

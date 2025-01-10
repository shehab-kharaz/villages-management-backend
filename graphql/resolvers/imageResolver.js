const { readDataFromFile, writeDataToFile } = require('../services/fileService');

const imageResolver = {
  Query: {
    images: async () => {
      try {
        const images = await readDataFromFile('IMAGES');
        return images;
      } catch (error) {
        throw new Error(`Error fetching images: ${error.message}`);
      }
    },
  },

  Mutation: {
    addImage: async (_, { url, description }) => {
      try {
        const images = await readDataFromFile('IMAGES');
        const newImage = {
          id: (images.length + 1).toString(),  
          url,
          description,
        };
        images.push(newImage);
        await writeDataToFile('IMAGES', images);
        return newImage;
      } catch (error) {
        throw new Error(`Error adding new image: ${error.message}`);
      }
    },
  },
};

module.exports = imageResolver;

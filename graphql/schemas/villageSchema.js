const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLInputObjectType } = require('graphql');
const fs = require('fs');
const path = require('path');

const villagesPath = path.join(__dirname, '../../data/villages.json');

const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(villagesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error('Error reading data from file');
  }
};

const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(villagesPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to file:", error);
    throw new Error('Error writing data to file');
  }
};


const AgeDistributionInputType = new GraphQLInputObjectType({
  name: 'AgeDistributionInput',
  fields: {
    age_0_18: { type: GraphQLFloat },
    age_19_35: { type: GraphQLFloat },
    age_36_50: { type: GraphQLFloat },
    age_51_65: { type: GraphQLFloat },
    age_65_plus: { type: GraphQLFloat },
  }
});

const GenderRatioInputType = new GraphQLInputObjectType({
  name: 'GenderRatioInput',
  fields: {
    male: { type: GraphQLFloat },
    female: { type: GraphQLFloat },
  }
});

const DemographicInputType = new GraphQLInputObjectType({
  name: 'DemographicInput',
  fields: {
    populationSize: { type: GraphQLInt },
    ageDistribution: { type: AgeDistributionInputType },
    genderRatio: { type: GenderRatioInputType },
    populationGrowthRate: { type: GraphQLFloat },
  }
});

const AgeDistributionType = new GraphQLObjectType({
  name: 'AgeDistribution',
  fields: {
    age_0_18: { type: GraphQLFloat },
    age_19_35: { type: GraphQLFloat },
    age_36_50: { type: GraphQLFloat },
    age_51_65: { type: GraphQLFloat },
    age_65_plus: { type: GraphQLFloat },
  }
});

const GenderRatioType = new GraphQLObjectType({
  name: 'GenderRatio',
  fields: {
    male: { type: GraphQLFloat },
    female: { type: GraphQLFloat },
  }
});

const DemographicType = new GraphQLObjectType({
  name: 'Demographic',
  fields: {
    populationSize: { type: GraphQLInt },
    ageDistribution: { type: AgeDistributionType },
    genderRatio: { type: GenderRatioType },
    populationGrowthRate: { type: GraphQLFloat },
  }
});

const VillageType = new GraphQLObjectType({
  name: 'Village',
  fields: {
    name: { type: GraphQLString },
    region: { type: GraphQLString },
    landArea: { type: GraphQLFloat },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    image: { type: GraphQLString }, 
    categories: { type: new GraphQLList(GraphQLString) },
    demographic: { type: DemographicType },
  }
});

const VillageInputType = new GraphQLInputObjectType({
  name: 'VillageInput',
  fields: {
    name: { type: GraphQLString },
    region: { type: GraphQLString },
    landArea: { type: GraphQLFloat },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    image: { type: GraphQLString },
    categories: { type: new GraphQLList(GraphQLString) },
    demographic: { type: DemographicInputType },  
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    villages: {
      type: new GraphQLList(VillageType),
      resolve(parent, args) {
        const data = readDataFromFile();
        return data;
      }
    },
    village: {
      type: VillageType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        const data = readDataFromFile();
        return data.find(village => village.name === args.name);
      }
    },
    statistics: {
      type: new GraphQLObjectType({
        name: 'Statistics',
        fields: {
          totalVillages: { type: GraphQLInt },
          totalUrbanAreas: { type: GraphQLInt },
          totalPopulation: { type: GraphQLInt },
          averageLandAreaInSqKm: { type: GraphQLFloat },
          ageDistribution: { type: AgeDistributionType },
          genderRatio: { type: GenderRatioType },
          populationDistribution: { type: new GraphQLList(new GraphQLObjectType({
            name: 'PopulationDistribution',
            fields: {
              name: { type: GraphQLString },
              population: { type: GraphQLInt }
            }
          })) }
        }
      }),
      resolve(parent, args) {
        const data = readDataFromFile();
        const totalVillages = data.length;
        const totalUrbanAreas = data.filter(village => 
          village.categories.some(category => category.toLowerCase() === 'urban')
        ).length;
        
        const totalPopulation = data.reduce((sum, village) => sum + (village.demographic?.populationSize || 0), 0);

        const averageLandAreaInSqKm = data.reduce((sum, village) => sum + (village.landArea || 0), 0) / totalVillages;

        let ageDistribution = {
          age_0_18: 0,
          age_19_35: 0,
          age_36_50: 0,
          age_51_65: 0,
          age_65_plus: 0
        };

        let genderRatio = {
          male: 0,
          female: 0
        };

        const populationDistribution = data.map(village => ({
          name: village.name,
          population: village.demographic?.populationSize || 0
        }));

        data.forEach(village => {
          if (village.demographic?.ageDistribution) {
            ageDistribution.age_0_18 += village.demographic.ageDistribution.age_0_18 || 0;
            ageDistribution.age_19_35 += village.demographic.ageDistribution.age_19_35 || 0;
            ageDistribution.age_36_50 += village.demographic.ageDistribution.age_36_50 || 0;
            ageDistribution.age_51_65 += village.demographic.ageDistribution.age_51_65 || 0;
            ageDistribution.age_65_plus += village.demographic.ageDistribution.age_65_plus || 0;
          }

          if (village.demographic?.genderRatio) {
            genderRatio.male += village.demographic.genderRatio.male || 0;
            genderRatio.female += village.demographic.genderRatio.female || 0;
          }
        });

        const ageTotal = Object.values(ageDistribution).reduce((sum, val) => sum + val, 0);
        const genderTotal = genderRatio.male + genderRatio.female;

        ageDistribution = Object.fromEntries(
          Object.entries(ageDistribution).map(([key, value]) => [key, value / ageTotal])
        );

        genderRatio = {
          male: genderRatio.male / genderTotal,
          female: genderRatio.female / genderTotal
        };

        return {
          totalVillages,
          totalUrbanAreas,
          totalPopulation,
          averageLandAreaInSqKm,
          ageDistribution,
          genderRatio,
          populationDistribution
        };
      }
    }
  }
});



const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addVillage: {
      type: VillageType,
      args: {
        village: { type: VillageInputType }
      },
      resolve(parent, { village }) {
        const data = readDataFromFile();
        if (!village.name || !village.region) {
          throw new Error("Village name and region are required.");
        }
        data.push(village);
        writeDataToFile(data);
        return village;
      }
    },
    updateVillage: {
      type: VillageType,
      args: {
        name: { type: GraphQLString },
        village: { type: VillageInputType }
      },
      resolve(parent, { name, village }) {
        const data = readDataFromFile();
        const index = data.findIndex(v => v.name === name);
        if (index !== -1) {
          data[index] = { ...data[index], ...village };
          writeDataToFile(data);
          return data[index];
        }
        throw new Error(`Village with name ${name} not found`);
      }
    },
    deleteVillage: {
      type: VillageType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, { name }) {
        const data = readDataFromFile();
        const updatedData = data.filter(village => village.name !== name);
        if (updatedData.length === data.length) {
          throw new Error(`Village with name ${name} not found`);
        }
        writeDataToFile(updatedData);
        return { name };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

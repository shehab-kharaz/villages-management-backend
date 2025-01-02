const { gql } = require('apollo-server-express');

module.exports = gql`
  type AgeDistribution {
    age_0_18: Float
    age_19_35: Float
    age_36_50: Float
    age_51_65: Float
    age_65_plus: Float
  }

  input AgeDistributionInput {
    age_0_18: Float
    age_19_35: Float
    age_36_50: Float
    age_51_65: Float
    age_65_plus: Float
  }

  type Statistics {
    totalVillages: Int
    totalUrbanAreas: Int
    totalPopulation: Int
    averageLandAreaInSqKm: Float
    ageDistribution: AgeDistribution
    genderRatio: GenderRatio
    populationDistribution: [PopulationDistribution]
  }

  type PopulationDistribution {
    name: String
    population: Int
  }

  type Query {
    villages: [Village]
    village(name: String!): Village
    statistics: Statistics
  }

  type GenderRatio {
    male: Float
    female: Float
  }

  input GenderRatioInput {
    male: Float
    female: Float
  }

  type Demographic {
    populationSize: Int
    ageDistribution: AgeDistribution
    genderRatio: GenderRatio
    populationGrowthRate: Float
  }

  input DemographicInput {
    populationSize: Int
    ageDistribution: AgeDistributionInput
    genderRatio: GenderRatioInput
    populationGrowthRate: Float
  }

  type Village {
    name: String!
    region: String
    landArea: Float
    latitude: Float
    longitude: Float
    image: String
    categories: [String]
    demographic: Demographic
  }

  input VillageInput {
    name: String!
    region: String
    landArea: Float
    latitude: Float
    longitude: Float
    image: String
    categories: [String]
    demographic: DemographicInput
  }

  type Query {
    villages: [Village]
    village(name: String!): Village
  }

  type Mutation {
    addVillage(village: VillageInput!): Village
    updateVillage(name: String!, village: VillageInput!): Village
    deleteVillage(name: String!): Village
  }
`;

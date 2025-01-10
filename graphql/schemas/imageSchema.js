const { gql } = require('apollo-server-express');

const imageSchema = gql`
  type Image {
    id: String
    url: String
    description: String
  }

  type Query {
    images: [Image]
  }

  type Mutation {
    addImage(url: String!, description: String!): Image
  }
`;

module.exports = imageSchema;

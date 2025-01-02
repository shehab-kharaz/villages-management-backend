const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
  fullName: String
  username: String
  password: String
}

type Mutation {
  signup(fullName: String!, username: String!, password: String!): User
}

`;

module.exports = typeDefs;

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    fullName: String
    username: String
    password: String
    role: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    signup(fullName: String!, username: String!, password: String!): User
    login(username: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

module.exports = typeDefs;

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const villageSchema = require('./schemas/villageSchema');
const userSchema = require('./schemas/userSchema');
const villageResolvers = require('./resolvers/villageResolver');
const userResolvers = require('./resolvers/userResolver');

const typeDefs = mergeTypeDefs([villageSchema, userSchema]);
const resolvers = mergeResolvers([villageResolvers, userResolvers]);
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const villageSchema = require('./schemas/villageSchema');
const userSchema = require('./schemas/userSchema');
const imageSchema = require('./schemas/imageSchema');
const villageResolvers = require('./resolvers/villageResolver');
const userResolvers = require('./resolvers/userResolver');
const imageResolver = require('./resolvers/imageResolver');

const typeDefs = mergeTypeDefs([villageSchema, userSchema, imageSchema]);
const resolvers = mergeResolvers([villageResolvers, userResolvers, imageResolver]);
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;

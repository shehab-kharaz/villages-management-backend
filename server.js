const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const villageSchema = require('./graphql/schemas/villageSchema');
const villageResolvers = require('./graphql/resolvers/village');
const graphqlPlayground = require('graphql-playground-middleware-express').default; 
const cors = require('cors')

const app = express();
app.use(cors())
app.get('/playground', graphqlPlayground({ endpoint: '/graphql' }));

app.use('/graphql', graphqlHTTP({
  schema: villageSchema,
  rootValue: villageResolvers,
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Hello from backend with port: ${PORT}`);
});

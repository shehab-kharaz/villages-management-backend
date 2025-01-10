require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const graphqlPlayground = require('graphql-playground-middleware-express').default;
const schema = require('./graphql/graphqlConfig');
const PORT = process.env.MAIN_PORT || 4000;


const app = express();
app.use(cors());
app.get('/playground', graphqlPlayground({ endpoint: '/graphql' }));
app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  graphiql: true, 
  context: { req }, 
})));

app.listen(PORT, () => {
  console.log(`Hello from backend with port: ${PORT}`);
});

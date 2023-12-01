const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//Imported Apollo Server
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
//Imported TypeDefs 
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

//server defined
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//starting Apollo Server
const startApolloServer = async () => {
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//using graphql middlewear
app.use('/graphql', expressMiddleware(server));

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// boilerplate
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} 


app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
};

//calling server to start
startApolloServer();

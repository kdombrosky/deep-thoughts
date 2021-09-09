const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require( 'apollo-server-core');
const http = require('http');
const path = require('path');

const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware ,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,
    path: '/'
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: 3001 }, resolve));
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)











// const express = require('express');
// // import ApolloServer
// const { ApolloServer } = require('apollo-server-express');

// // import our typeDefs and resolvers
// const { typeDefs, resolvers } = require('./schemas');
// const { authMiddleware } = require('./utils/auth');
// const db = require('./config/connection');

// const PORT = process.env.PORT || 3001;
// const app = express();
// // create a new Apollo server and pass in our schema data
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   // ensure every request performs an authentication check
//   context: authMiddleware
// });

// console.log(server)

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Added by Hamzah to fix
// async function start() {
//   await server.start()
// }
// start()
// // End Add


// db.once('open', () => {
//   // Moved in here to work
//   // integrate our Apollo server with the Express application as middleware
//   server.applyMiddleware({app})
//   // End Move
  
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     // log where we can go to test our GQL API
//     console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
//   })
// })

import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import react router dom
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import page components
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// establish a new link to the GraphQL server at its /graphql endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// use ApolloClient() to instantiate Apollo Client instance
// and create connection to the API endpoint
const client = new ApolloClient({
  link: httpLink,
  // instantiate new cache object
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/thought" component={SingleThought} />

              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

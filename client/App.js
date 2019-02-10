/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { hot } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';
import { onError } from 'apollo-link-error';

import 'typeface-roboto';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Header from './containers/Header';
import CognateContainer from './containers/CognateContainer';
import styles from './styles';
import InstructorTable from './containers/InstructorTable';

/**
 * AUTHENTICATION
 * */

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('x-token');
  const customHeaders = {
    ...headers,
  };
  customHeaders['x-token'] = token ? token : '';
  return {
    headers: customHeaders,
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// MUTATION
const CREATE_USER = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, password: $password, email: $email) {
      token
    }
  }
`;

// MUTATION
const SIGN_IN = gql`
  mutation login($email: String!, $password: String!) {
    signIn(password: $password, login: $email) {
      token
    }
  }
`;

export const GET_ME = gql`
  {
    me {
      username
      email
      role
    }
  }
`;

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: blue,
  },
  typography: {
    h1: {
      // In Japanese the characters are usually larger.
      fontSize: 30,
    },
    fontSize: 24,
    htmlFontSize: 16,
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <div css={css(styles.containerGrid)}>
      <ApolloProvider client={client}>
        <CssBaseline />
        <Header />
        <CognateContainer client={client} />
        <InstructorTable />
      </ApolloProvider>
    </div>
  </MuiThemeProvider>
);

export default hot(module)(App);

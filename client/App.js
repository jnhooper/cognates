
import React from 'react';
import { hot } from 'react-hot-loader';
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { Mutation, Query, ApolloConsumer } from "react-apollo";
import { onError } from "apollo-link-error";

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button";

import Header from './containers/Header';
import CognateContainer from './containers/CognateContainer';

/**
 * AUTHENTICATION
 * */ 
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('x-token');
  const customHeaders = {
    ...headers,
  };
  customHeaders['x-token']= token ? token : ""
  return {
    headers: customHeaders
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

  // MUTATION
  const CREATE_USER = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, password: $password, email: $email){
      token
    }
  }
`;
  
// MUTATION
  const SIGN_IN = gql`
  mutation login($email: String!, $password: String!) {
    signIn(password: $password, login: $email){
      token
    }
  }
`;


export const GET_ME = gql`
  {
    me {
      username
      email
    }
  }
`

const SignUp = (props) => {
  let username;
  let password;
  let email;
  let signInEmail;
  let signInPassword;


    return ( 
      <ApolloConsumer>
      {
        (client_local) => (
          <React.Fragment>
      <Mutation 
        mutation={CREATE_USER}
        onError={(error)=> {
          console.error(error);
          localStorage.removeItem("x-token")
        }}
        onCompleted={(data) => {
          console.log(data.signUp)
          localStorage['x-token'] = data.signUp.token;
          // props.onSuccess(data);
        }}
        update={(cache, { data: { me } }) => {
          // const { me } = cache.readQuery({ query: GET_ME });
          client_local.query(GET_ME)
          cache.writeQuery({
            query: GET_ME,
            data: { me: me},
          });
        }}
      >
      {(signUp, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              console.log(signUp);
              localStorage.removeItem('x-token')
              signUp({
                variables: {
                  username: username.value,
                  password: password.value,
                  email: email.value,
                }
               })
            }}
          >
            <label htmlFor="username">Username</label>
            <input
              id="username"
              ref={node => {
                username = node;
              }}
            />
            <label htmlFor="Email">Email</label>
            <input
              id="email"
              ref={node => {
                email = node;
              }}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              ref={node => {
                password = node;
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </div>
      )}
    </Mutation>
    <Mutation
      mutation={SIGN_IN}
        onCompleted={(data) => {
          console.log(data.signIn)
          localStorage['x-token'] = data.signIn.token;
          props.onSuccess(data);
        }
      }
    >
      {(signIn, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              localStorage.removeItem('x-token')
              signIn({
                variables: {
                  password: signInPassword.value,
                  email: signInEmail.value,
                }
               })
            }}
          >
            <label htmlFor="EmailIn">Sign in Email</label>
            <input
              id="emailIn"
              ref={node => {
                signInEmail = node;
              }}
            />
            <label htmlFor="passwordIn">Password</label>
            <input
              id="passwordIn"
              type="password"
              ref={node => {
                signInPassword = node;
              }}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      )}
    </Mutation>
    </React.Fragment>
      )
    }
    </ApolloConsumer>
  )
}


// const Name = () => (
//   <Query
//     query={GET_ME}
//   >
//     {({ loading, error, data, refetch }) => {
//       if (loading) return "Loading...";
//       if(!data.me) {
//           localStorage.removeItem("x-token")
//           // client.cache.reset();
//         return <SignUp onSuccess={data => refetch()}/>
//       }
//       if (error) return `Error! ${error.message}`;

//       return (
//         <h3>{data.me.username}</h3>
//       );
//     }}
//   </Query>
// )


const App = () => (
  <ApolloProvider client={client}>
    <CssBaseline/>
    <Header/>
    <CognateContainer client={client}/>
  </ApolloProvider>
);

export default hot(module)(App);


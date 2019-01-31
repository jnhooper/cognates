import React from 'react';
import { hot } from 'react-hot-loader';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";


const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

console.log(client);

client
  .query({
    query: gql`
      { 
        users {
          email
          username
        }
      }
    `
  })
  .then(result => console.log(result));

  // MUTATION
  const CREATE_USER = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, password: $password, email: $email){
      token
    }
  }
`;

const SignUp =   () => {
  let input;
  
    return ( <Mutation mutation={CREATE_USER}>
      {(signUp, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              signUp({
                variables: {
                  username: 'test',
                  password: 'password',
                  email: input.value,
                }
               });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  )
}
const App = () => (
  <ApolloProvider client={client}>
    <div>
      hello
      <SignUp/>
    </div>
  </ApolloProvider>
);

export default hot(module)(App);


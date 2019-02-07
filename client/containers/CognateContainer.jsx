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

import Button from "@material-ui/core/Button";

import CreateCognate from './CreateCognate';

export const GET_ALL_COGNATES = gql `
query{
  cognates {
    english
    russian
    user {
      email
    }
  }
  me {
    email
  }
}
`


class CognateContainer extends React.Component{
    
  render(){
    console.log('what')
    return (
      <Query
        query={GET_ALL_COGNATES}
      >
      {({ loading, error, data, refetch }) => {
        console.log("data",error, data);
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <div>
            <h1>Cognates:</h1>
            {
              data.cognates &&
                data.cognates.map(cognate => (
                  <React.Fragment>
                  <h3>{cognate.english}</h3>
                  <h3>{cognate.russian}</h3>
                  </React.Fragment>
                )
              )
            }
            {
              data.me && data.me.email &&
                <CreateCognate client={this.props.client}/>
            }
          </div>
        );
      }}
      </Query>
    );
  }
}

export default CognateContainer;
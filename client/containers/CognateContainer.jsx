/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';
import { onError } from 'apollo-link-error';

import CreateCognate from './CreateCognate';

import Cognate from '../components/Cognate';
import CognateList from '../components/CognateList';
import Hello from '../components/Hello';

export const GET_ALL_COGNATES = gql`
  query {
    cognates {
      english
      russian
      id
    }
  }
`;

const CognateContainer = props => {
  return (
    <Query query={GET_ALL_COGNATES}>
      {({ loading, error, data, refetch }) => {
        console.log('data', error, data);
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { cognates } = data;
        // useState({ left: cognates.length - 1, center: 0, right: 1 });
        if (cognates.length === 0) {
          return <h1>hmmm... There's nothing here <Hello compiler="my ass" framework="finally"/></h1>;
        }
        return (
          <div>
            <CognateList cognates={cognates} />
          </div>
        );
      }}
    </Query>
  );
};

export default CognateContainer;

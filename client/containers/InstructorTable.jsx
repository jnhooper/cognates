/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';
import { onError } from 'apollo-link-error';
import Button from '@material-ui/core/Button';

import CreateCognate from './CreateCognate';
import { GET_ALL_COGNATES } from './CognateContainer';

export const GET_ALL_COGNATES_AND_ROLE = gql`
  query {
    cognates {
      english
      russian
      id
    }
    me {
      role
    }
  }
`;

//TODO move this out into a separate file
const DELETE_COGNATE = gql`
  mutation DeleteCognate($id: ID!) {
    deleteCognate(id: $id) {
      id
      success
    }
  }
`;
const InstructorTable = props => {
  const [deleteId, setDelete] = useState();
  console.log(deleteId, 'delete id');
  return (
    <Query query={GET_ALL_COGNATES_AND_ROLE}>
      {({ loading, error, data, refetch }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { cognates } = data;
        // useState({ left: cognates.length - 1, center: 0, right: 1 });
        console.log('instructor', data);
        if (
          data.me &&
          (data.me.role === 'ADMIN' || data.me.role === 'INSTRUCTOR')
        ) {
          return (
            <div>
              <div
                css={css(`
                  display: grid;
                  grid-template-columns:repeat(4,1fr);
                `)}
              >
                <h3>English</h3>
                <h3>Russian</h3>
                <div />
                <div />
                {cognates.map(cognate => (
                  <>
                    <div>{cognate.english}</div>
                    <div>{cognate.russian}</div>
                    <div>edit</div>
                    <Mutation
                      mutation={DELETE_COGNATE}
                      onSuccess={data => {
                        console.log(data);
                      }}
                      update={(
                        cache,
                        {
                          data: {
                            deleteCognate: { id, success },
                          },
                        }
                      ) => {
                        console.log(id, success);
                        if (success) {
                          const { cognates } = cache.readQuery({
                            query: GET_ALL_COGNATES,
                          });
                          cache.writeQuery({
                            query: GET_ALL_COGNATES,
                            data: {
                              cognates: cognates.filter(c => c.id !== id),
                            },
                          });

                          setDelete();
                        }
                      }}
                    >
                      {(deleteCognate, { data }) => (
                        <Button
                          onClick={() => {
                            console.log(data);
                            setDelete(cognate.id);
                            console.log(deleteId);
                            deleteCognate({
                              variables: { id: parseInt(cognate.id) },
                            });
                          }}
                          color="secondary"
                        >
                          delete
                        </Button>
                      )}
                    </Mutation>
                  </>
                ))}
              </div>
              <CreateCognate />
            </div>
          );
        } else {
          return null;
        }
      }}
    </Query>
  );
};

export default InstructorTable;

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Form, Field } from 'react-final-form';

import { GET_ALL_COGNATES } from './CognateContainer';

const CREATE_COGNATE = gql`
  mutation CreateCognate($english: String!, $russian: String!) {
    createCognate(english: $english, russian: $russian) {
      english
      russian
      id
    }
  }
`;

const generateInput = (input, label) => (
  <TextField label={label} {...input.input} margin="normal" />
);

const CreateCognate = props => {
  const [show, showForm] = useState(false);
  // return <h1>{`${show}`}</h1>;

  return (
    <React.Fragment>
      {!show && <Button onClick={() => showForm(true)}>+</Button>}
      {show && (
        <Mutation
          mutation={CREATE_COGNATE}
          onSuccess={data => console.log(data)}
          update={(cache, { data: { createCognate } }) => {
            // console.log(data);
            const { cognates } = cache.readQuery({ query: GET_ALL_COGNATES });
            console.log(cognates, createCognate);
            cache.writeQuery({
              query: GET_ALL_COGNATES,
              data: { cognates: cognates.concat(createCognate) },
            });
          }}
        >
          {(createCognate, { data }) => (
            <React.Fragment>
              <h2>Submit New Cognate</h2>
              <Form
                onSubmit={async values => {
                  const variables = { ...values };
                  createCognate({
                    variables,
                  });
                }}
                render={({ handleSubmit, reset }) => (
                  <form
                    onSubmit={event => {
                      handleSubmit(event).then(() => {
                        reset();
                      });
                    }}
                  >
                    <div
                      css={css(`
                    display: grid;
                    grid-template-columns: auto auto 1fr;
                    grid-template-rows: auto auto;
                    grid-gap: 1rem;
                    > button {
                      grid-row: 2/3;
                      // grid-column: 2/3;
                    }
                  `)}
                    >
                      <Field name="english">
                        {input => generateInput(input, 'Enlish')}
                      </Field>
                      <Field name="russian">
                        {input => generateInput(input, 'Russian')}
                      </Field>
                      <Button
                        onClick={() => showForm(false)}
                        variant="contained"
                        color="secondary"
                      >
                        cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </div>
                  </form>
                )}
              />
            </React.Fragment>
          )}
        </Mutation>
      )}
    </React.Fragment>
  );
};

export default CreateCognate;

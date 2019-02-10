/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Form, Field } from 'react-final-form';

import { GET_ME, CREATE_USER, SIGN_IN } from '../../queries/user';
// import { GET_ALL_COGNATES } from './CognateContainer';
import { grid, submitButtons, loginSignupButtons } from './styles';

const formTypes = {
  login: 'LOGIN',
  signUp: 'SIGN_UP',
};

class Login extends React.Component {
  state = {
    formVisible: false,
  };

  showForm = formName => {
    this.setState({
      formVisible: formName,
    });
  };

  getDataName = () => {
    return this.state.formVisible === formTypes.login ? 'signIn' : 'signUp';
  };

  generateInput = (input, label, type) => (
    <TextField label={label} {...input.input} type={type} margin="normal" />
  );

  render() {
    const props = this.props;

    return (
      <div>
        {!this.state.formVisible && (
          <div css={css(loginSignupButtons)}>
            <Button
              onClick={() => {
                this.showForm(formTypes.login);
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                this.showForm(formTypes.signUp);
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
        {this.state.formVisible && (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={
                  this.state.formVisible === 'SIGN_UP' ? CREATE_USER : SIGN_IN
                }
                onError={error => {
                  console.error(error);
                  localStorage.removeItem('x-token');
                }}
                onCompleted={data => {
                  console.log(data);
                  localStorage['x-token'] = data[this.getDataName()].token;
                  props.onSuccess(data);
                  this.showForm(false);
                }}
              >
                {(login, { data }) => (
                  <div>
                    <Form
                      onSubmit={async values => {
                        // e.preventDefault();
                        console.log('values', values);
                        console.log(values.firstName);
                        localStorage.removeItem('x-token');
                        const variables = {
                          ...values,
                        };
                        login({
                          variables,
                        });
                      }}
                      render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} css={css(grid)}>
                          {this.state.formVisible === 'SIGN_UP' && (
                            <>
                              <Field name="firstName">
                                {input =>
                                  this.generateInput(input, 'First Name')
                                }
                              </Field>
                              <Field name="lastName">
                                {input =>
                                  this.generateInput(input, 'Last Name')
                                }
                              </Field>
                            </>
                          )}
                          <Field name="email">
                            {input => this.generateInput(input, 'Email')}
                          </Field>

                          <Field name="password" type="password">
                            {input =>
                              this.generateInput(input, 'Password', 'password')
                            }
                          </Field>

                          <div css={css(submitButtons)}>
                            <Button onClick={() => this.showForm(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
                            >
                              {this.state.formVisible === formTypes.login
                                ? 'Login'
                                : 'Sign Up'}
                            </Button>
                          </div>
                        </form>
                      )}
                    />
                  </div>
                )}
              </Mutation>
            )}
          </ApolloConsumer>
        )}
      </div>
    );
  }
}

export default Login;

import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Form, Field } from 'react-final-form';

import { GET_ME, CREATE_USER, SIGN_IN } from '../queries/user';
import { GET_ALL_COGNATES } from './CognateContainer';

class Input extends React.Component {
  render() {
    const { props } = this;
    return (
      <TextField
        id={props.id}
        label={props.label}
        className={props.className}
        type={props.type}
        margin="normal"
      />
    );
  }
}

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

  generateInput = (id, label, type) => (
    <TextField id={id} label={label} type={type} margin="normal" />
  );

  render() {
    let signInEmail;
    let signInPassword;
    const props = this.props;

    const firstName = (
      <Input id="firstName" label="First Name" placeholder="First Name" />
    );
    return (
      <div>
        {!this.state.formVisible && (
          <React.Fragment>
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
          </React.Fragment>
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
                        console.log(values);
                        localStorage.removeItem('x-token');
                        const variables = {
                          ...values,
                        };
                        login({
                          variables,
                        });
                      }}
                      render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          {this.state.formVisible === 'SIGN_UP' && (
                            <>
                              <Field
                                name="firstName"
                                component={() =>
                                  this.generateInput('firstName', 'First Name')
                                }
                              />
                              <Field
                                name="lastName"
                                component={() =>
                                  this.generateInput('lastName', 'Last Name')
                                }
                              />
                            </>
                          )}
                          <Field
                            name="email"
                            component={() =>
                              this.generateInput('email', 'Email')
                            }
                            placeholder="email"
                          />
                          <Field
                            name="password"
                            type="password"
                            component={() =>
                              this.generateInput(
                                'password',
                                'Password',
                                'password'
                              )
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            {this.state.formVisible === formTypes.login
                              ? 'Login'
                              : 'Sign Up'}
                          </Button>
                          <Button onClick={() => this.showForm(false)}>
                            Cancel
                          </Button>
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

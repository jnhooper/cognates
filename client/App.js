
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


/**
 * AUTHENTICATION
 * */ 
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('x-token');
  console.log('authlink', token);
  console.log(localStorage)
  const customHeaders = {
    ...headers,
  };
  // if(token){
    customHeaders['x-token']= token ? token : ""
    console.log(customHeaders)
  // }
  // return the headers to the context so httpLink can read them
  return {
    headers: customHeaders
  }
});

const client = new ApolloClient({
  // uri: "http://localhost:3000/graphql",

  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // clientState: {
  //   defaults: {
  //     me: {
  //       test:'ing'
  //     }
  //   }
  // }

});
// cache.writeData({data:{test:"balls"}})


// client
//   .query({
//     query: gql`
//       { 
//         users {
//           email
//           username
//         }
//       }
//     `
//   })
//   .then(result => console.log("test",result));

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

/**
 * KABIR CODES
 */

class WithHooperApp extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isAuthed: localStorage.getItem("x-token"),
    }
    console.log(this.state.isAuthed)
    const apolloErrorLink = onError(({ networkError, operation, forward }) => {
      // There's a bug in the apollo typedefs and `statusCode` is not recognized, but it's there
      if (networkError && networkError.statusCode === 401) {
        localStorage.deleteItem('x-token');
        this.setState({ isAuthed: false });
      }
      return forward(operation);
    });

    const apolloAuthLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        "x-token": localStorage.getItem('x-token'),
        Authorization: `Bearer: ${localStorage.getItem('x-token')}`,
      },
    }));

    // const apolloHttpLink = createHttpLink({ uri: apiRoutes.graphql() });
    const apolloHttpLink = createHttpLink({
      uri: "http://localhost:3000/graphql",
    })

    const apolloCache = new InMemoryCache();

    this.apolloClient = new ApolloClient({
      link: apolloAuthLink.concat(apolloHttpLink),
      cache: apolloCache,
    });
  }

  componentDidMount() {
    this.setState({ isAuthed: localStorage.getItem("x-token")})//isEmpty(localStorage.getItem("hooper-app-token")) });

  }


  handleLogin = (token) => {
    console.log(token)
    // localStorage.setItem('x-token', token);
    this.setState({ isAuthed: true });
  }

  render() {
    const { isAuthed } = this.state;
    return (
      <ApolloProvider client={this.apolloClient}>
        {this.props.children({ isAuthed, handleLogin: this.handleLogin })}
      </ApolloProvider>
     );
  }
}

/*************************************************************************************
 * end kabir codes
 */


const oldGET_ME= gql`
  query me {
    user {
      username
      email
    }
  }
`;

const GET_ME = gql`
  {
    me {
      username
      email
    }
  }
`

const client_GET_ME = gql`
  query pleaseGetMe {
    test @client
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
          console.log('shit')
          console.warn(error);
          localStorage.removeItem("x-token")
          client_local.clearStore();
        }}
        onCompleted={(data) => {
          console.log(data.signUp)
          localStorage['x-token'] = data.signUp.token;
          client_local.clearStore().then(() => props.onSuccess(data))
          // props.onSuccess(data);
          // client_local.writeData({data: {test: "fuck"}});
          // props.onSuccess(result)
          //update the user
          // client
          //   .query({
          //     query: gql`
          //       { 
          //         me {
          //           email
          //           username
          //         }
          //       }
          //     `
          //   })
          // client_local.query({query: GET_ME})
          //   .then(result => {
          //     console.log(result.data);
          //     client_local.writeData({data: {test: "shit"}})
          //     console.log(client_local);
          //     console.log("result", result);
          //     props.onSuccess(result);
          //     // console.log(cache)
              
          //   });
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
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
    <Mutation
      mutation={SIGN_IN}
        onCompleted={(data) => {
          console.log(data.signIn)
          localStorage['x-token'] = data.signIn.token;
          client_local.clearStore().then(() => props.onSuccess(data))
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


const Name = () => (
  <Query
    query={GET_ME}
  >
    {({ loading, error, data, refetch }) => {
      console.log("data", data);
      if (loading) return "Loading...";
      if(error || !data.me) {
          localStorage.removeItem("x-token")
          client.cache.reset();
          client.clearStore();
        return <SignUp onSuccess={data => refetch()}/>
      }
      if (error) return `Error! ${error.message}`;
      console.log("past signup", data);

      return (
        <h3>{data.me.username}</h3>
      );
    }}
  </Query>
)

class UserBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
    }
  }

  render(){
    return (
      <div>
        {
          this.state.loggedIn &&
          <Name/>
        }
        {
          !this.state.loggedIn &&
          <SignUp
            onSuccess={()=>{this.setState({loggedIn: true})}}
          />
        }
      </div>
    )
  }
}

const App = () => (
  <ApolloProvider client={client}>
  <Name/>
    {/* <UserBar/> */}
  </ApolloProvider>
);

// const KabirApp = () => (
//   <WithHooperApp>
//     {({ isAuthed, handleLogin }) => {
//       if (!isAuthed) {
//         console.log("sign up", isAuthed)
//         return (
//            <SignUp onSuccess={handleLogin}/>
//         )
//        } else {
//         console.log("view name", isAuthed)
//          return <Name/>
//        }
//       }
//     }
//   </WithHooperApp>
// )

export default hot(module)(App);


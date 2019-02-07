import gql from "graphql-tag";

export const GET_ME = gql`
  {
    me {
      firstName
      lastName
      email
    }
  }
`


export const CREATE_USER = gql`
  mutation SignUp($firstName: String!, $lastName: String, $email: String!, $password: String!) {
    signUp(firstName: $firstName, lastName: $lastName, password: $password, email: $email){
      token
    }
  }
`;
  
// MUTATION
export const SIGN_IN = gql`
  mutation login($email: String!, $password: String!) {
    signIn(password: $password, email: $email){
      token
    }
  }
`;
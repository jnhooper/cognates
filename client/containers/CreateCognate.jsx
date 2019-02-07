import React from 'react';
import {Mutation} from 'react-apollo';
import gql from "graphql-tag";

import Button from '@material-ui/core/Button';


  const CREATE_COGNATE = gql`
    mutation CreateCognate(
      $english: String!
      $russian: String!
    ) {
        createCognate(english: $english, russian: $russian){
          english
          russian
        }
      }
`;
class CreateCognate extends React.Component {

  render(){
    let english;
    let russian;
    return (
      <Mutation
        mutation={CREATE_COGNATE}
        onSuccess={(data)=> console.log(data)}
      >
      {(createCognate, { data }) => (
          <form
            onSubmit={(e)=>{
              e.preventDefault();
              createCognate({
                variables: {
                  english: english.value,
                  russian: russian.value,
                }
              });
            }}
          >
            <label htmlFor="English">English</label>
            <input
              id="English"
              type="text"
              ref={node => {
                english = node;
              }}
            />
            <label htmlFor="Russian">Russian</label>
            <input
              id="Russian"
              type="text"
              ref={node => {
                russian = node
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default CreateCognate;
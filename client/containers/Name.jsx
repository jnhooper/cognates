import React from 'react'
import {Query} from 'react-apollo';

import {GET_ME} from '../queries/user.jsx';
import Login from './Login';

const Name = () => (
  <Query
    query={GET_ME}
  >
    {({ loading, error, data, refetch }) => {
      if (loading) return "Loading...";
      if(!data.me) {
          localStorage.removeItem("x-token")
          // client.cache.reset();
        return <Login onSuccess={data => refetch()}/>
      }
      if (error) return `Error! ${error.message}`;

      return (
        <h3>привет {data.me.firstName}</h3>
      );
    }}
  </Query>
)

export default Name;
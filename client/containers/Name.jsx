import React from 'react';
import { Query } from 'react-apollo';

import { GET_ME } from '../queries/user.jsx';
import Login from './Login';
import Button from '@material-ui/core/Button';

const Name = () => (
  <Query query={GET_ME}>
    {({ loading, error, data, refetch }) => {
      if (loading) return 'Loading...';
      if (!data.me) {
        localStorage.removeItem('x-token');
        // client.cache.reset();
        return <Login onSuccess={data => refetch()} />;
      }
      if (error) return `Error! ${error.message}`;

      return (
        <div>
          <h1>привет {data.me.firstName}</h1>
          <Button
            onClick={e => {
              localStorage.removeItem('x-token');
              refetch();
            }}
          >
            Logout
          </Button>
        </div>
      );
    }}
  </Query>
);

export default Name;

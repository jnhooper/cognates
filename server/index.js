import jwt from 'jsonwebtoken';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET
    };
  }
});

const app = express();
server.applyMiddleware({ app });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWidthCognates();
  }
  app.listen({ port: 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
  );
});

const createUserWidthCognates = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'password',
      role: 'ADMIN',
      messages: [
        {
          english: 'John',
          russian: 'Джон',
        }
      ]
    },
    {
      include: [models.Cognate]
    }
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'password',
      cognates: [
        {
          english: 'Doctor',
          russian: 'Доктор',
        }
      ]
    },
    {
      include: [models.Cognate]
    }
  );
};

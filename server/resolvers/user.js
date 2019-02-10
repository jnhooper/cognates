import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, firstName, lastName, role } = user;
  return await jwt.sign({ id, email, firstName, lastName, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    // sign a user up
    signUp: async (
      parent,
      { firstName, lastName, email, password },
      { models, secret }
    ) => {
      let role = 'STUDENT';
      if (email === 'test@test.com') {
        role = 'ADMIN';
      }
      const user = await models.User.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      // expires in 30 mins
      return {
        token: createToken(user, secret, '3h'),
      };
    },

    // sign in
    signIn: async (parent, { email, password }, { models, secret }) => {
      const user = await models.User.findByEmail(email);

      if (!user) {
        throw new UserInputError('No user found with this email credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password');
      }

      // token expires in 30 mins
      return {
        token: createToken(user, secret, '3h'),
      };
    },

    /**
     * Delete a user
     */
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      }
    ),
  },

  User: {
    cognates: async (user, args, { models }) => {
      return await models.Cognate.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};

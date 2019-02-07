import { combineResolvers } from 'graphql-resolvers';

import {
  isAuthenticated,
  isMessageOwner,
} from './authorization';

export default {
  Query: {
    cognates: async (
      parent,
      { offset = 0, limit = 100 },
      { models }
    ) => {
      return await models.Cognate.findAll(
        {
          offset,
          limit,
        }
      );
    },
    cognate: async (
      parent,
      { id },
      { models }
    ) => {
      return await models.Cognate.findById(
        id
      );
    },
  },

  Mutation: {
    createCognate: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { english, russian, isVocab },
        { me, models }
      ) => {
        return await models.Cognate.create(
          {
            english,
            russian,
            userId: me.id,
            isVocab
          }
        );
      }
    ),

    deleteCognate: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (
        parent,
        { id },
        { models }
      ) => {
        return await models.Cognate.destroy(
          { where: { id } }
        );
      }
    ),
  },

  Cognate: {
    user: async (
      cognate,
      args,
      { models }
    ) => {
      return await models.User.findById(
        cognate.userId
      );
    },
  },
};

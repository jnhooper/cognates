import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner, canCreate } from './authorization';

export default {
  Query: {
    cognates: async (parent, { offset, limit }, { models }) => {
      return await models.Cognate.findAll({
        offset,
        limit,
      });
    },
    cognate: async (parent, { id }, { models }) => {
      return await models.Cognate.findById(id);
    },
  },

  Mutation: {
    createCognate: combineResolvers(
      isAuthenticated,
      canCreate,
      async (parent, { english, russian, isVocab }, { me, models }) => {
        return await models.Cognate.create({
          english,
          russian,
          userId: me.id,
          isVocab,
        });
      }
    ),

    deleteCognate: combineResolvers(
      isAuthenticated,
      canCreate,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        const success = await models.Cognate.destroy({ where: { id } });
        return {
          success,
          id,
        };
      }
    ),
  },

  Cognate: {
    user: async (cognate, args, { models }) => {
      return await models.User.findById(cognate.userId);
    },
  },
};

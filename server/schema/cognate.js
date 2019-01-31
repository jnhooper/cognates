import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    cognates(
      offset: Int
      limit: Int
    ): [Cognate!]!
    cognate(id: ID!): Cognate!
  }

  extend type Mutation {
    createCognate(
      english: String!
      russian: String!
    ): Cognate!
    deleteCognate(id: ID!): Boolean!
  }

  type Cognate {
    id: ID!
    english: String!
    russian: String!
    user: User!
  }
`;

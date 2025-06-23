import { createSchema, createYoga } from 'graphql-yoga';

const typeDefs = /* GraphQL */ `
  type Item {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    items: [Item!]!
  }
`;

const items = [
  { id: '1', name: 'Notebook', description: 'A paper notebook' },
  { id: '2', name: 'Pen', description: 'A blue ink pen' },
];

const resolvers = {
  Query: {
    items: () => items,
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql2',
});

export default yoga;
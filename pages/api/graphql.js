// pages/api/graphql.js
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

  type Mutation {
    addItem(name: String!, description: String!): Item!
  }
`;

let items = [
  { id: '1', name: 'Notebook', description: 'A paper notebook' },
  { id: '2', name: 'Pen', description: 'A blue ink pen' },
];

const resolvers = {
  Query: {
    items: () => items,
  },
  Mutation: {
    addItem: (_, { name, description }) => {
      const newItem = {
        id: String(items.length + 1),
        name,
        description,
      };
      items.push(newItem);
      return newItem;
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
});

export default yoga;
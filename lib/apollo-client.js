// apollo-client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql', // GraphQL 서버 URL
  cache: new InMemoryCache(),
});

export default client;
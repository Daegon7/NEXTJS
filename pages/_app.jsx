// pages/_app.js
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';

import '@/css/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
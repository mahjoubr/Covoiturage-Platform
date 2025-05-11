import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Auth middleware for HTTP and WS
const authToken = () => localStorage.getItem('auth_token');

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: () => ({
    headers: {
      authorization: authToken() ? `Bearer ${authToken()}` : '',
    }
  }),
}));

// Auth link for HTTP requests
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: authToken() ? `Bearer ${authToken()}` : '',
  },
}));

// Split traffic between HTTP and WS
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === 'OperationDefinition' &&
      def.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client setup
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;

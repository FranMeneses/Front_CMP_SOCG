import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: `${process.env.NODE_ENV}/graphql`,
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        subtasks: {
          merge(_, incoming) {
            return incoming;
          },
        },
        tasks: {
          merge(_, incoming) {
            return incoming;
          },
        },
        tasksByProcess: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { Book, Resolvers } from './src/generated/graphql';

(async () => {
  const schema = loadSchemaSync('./schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  });

  const books: Book[] = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

  const resolvers: Resolvers = {
    Query: {
      books: (): Book[] => books,
    },
  };

  const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
  const server = new ApolloServer({ schema: schemaWithResolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})()
  .then(() => console.log('Server started...'))
  .catch((e) => console.error(e));

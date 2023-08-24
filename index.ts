import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import fs from 'fs/promises';

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { Pokemon, Resolvers } from './src/generated/graphql';

(async () => {
  const schema = loadSchemaSync('./schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  });

  const pokemons: Pokemon[] = await fs.readFile('./data/pokemons.json', 'utf-8').then((data) => JSON.parse(data));

  const resolvers: Resolvers = {
    Query: {
      pokemons: (): Pokemon[] => pokemons,
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

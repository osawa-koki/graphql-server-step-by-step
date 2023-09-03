import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import fs from 'fs/promises';

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { Pokemon, PokemonFilter, Resolvers } from './src/generated/graphql';

(async () => {
  const schema = loadSchemaSync('./schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  });

  const pokemons: Pokemon[] = await fs.readFile('./data/pokemons.json', 'utf-8').then((data) => JSON.parse(data));

  const resolvers: Resolvers = {
    Query: {
      pokemons: (filter: PokemonFilter): Pokemon[] => {
        if (filter == null) {
          return pokemons;
        }
        const {
          name,
          types,
          hp_min,
          hp_max,
          atk_min,
          atk_max,
          def_min,
          def_max,
          spatk_min,
          spatk_max,
          spdef_min,
          spdef_max,
          spd_min,
          spd_max
        } = filter;
        return pokemons.filter((pokemon) => {
          if (name != null && !pokemon.name.toLowerCase().includes(name.toLowerCase())) {
            return false;
          }
          if (types != null && !types.every((type) => pokemon.types.includes(type))) {
            return false;
          }
          if (hp_min != null && pokemon.hp < hp_min) {
            return false;
          }
          if (hp_max != null && pokemon.hp > hp_max) {
            return false;
          }
          if (atk_min != null && pokemon.atk < atk_min) {
            return false;
          }
          if (atk_max != null && pokemon.atk > atk_max) {
            return false;
          }
          if (def_min != null && pokemon.def < def_min) {
            return false;
          }
          if (def_max != null && pokemon.def > def_max) {
            return false;
          }
          if (spatk_min != null && pokemon.spatk < spatk_min) {
            return false;
          }
          if (spatk_max != null && pokemon.spatk > spatk_max) {
            return false;
          }
          if (spdef_min != null && pokemon.spdef < spdef_min) {
            return false;
          }
          if (spdef_max != null && pokemon.spdef > spdef_max) {
            return false;
          }
          if (spd_min != null && pokemon.spd < spd_min) {
            return false;
          }
          if (spd_max != null && pokemon.spd > spd_max) {
            return false;
          }
          return true;
        });
      },
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

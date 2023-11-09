import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import fs from 'fs/promises'

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import { type Pokemon, type Resolvers } from './src/generated/graphql';

(async () => {
  const schema = loadSchemaSync('./schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  })

  const pokemons: Pokemon[] = await fs.readFile('./data/pokemons.json', 'utf-8').then((data) => JSON.parse(data))

  const resolvers: Resolvers = {
    Query: {
      pokemons: (_parent, { filter }): Pokemon[] => {
        if (filter == null) {
          return pokemons
        }
        const {
          name,
          types,
          hpMin,
          hpMax,
          atkMin,
          atkMax,
          defMin,
          defMax,
          spatkMin,
          spatkMax,
          spdefMin,
          spdefMax,
          spdMin,
          spdMax
        } = filter
        return pokemons.filter((pokemon) => {
          if (name != null && pokemon.name.toLowerCase() !== name.toLowerCase()) {
            return false
          }
          if (types != null && !(types as string[]).every((type) => pokemon.types.includes(type))) {
            return false
          }
          if (hpMin != null && pokemon.hp < hpMin) {
            return false
          }
          if (hpMax != null && pokemon.hp > hpMax) {
            return false
          }
          if (atkMin != null && pokemon.atk < atkMin) {
            return false
          }
          if (atkMax != null && pokemon.atk > atkMax) {
            return false
          }
          if (defMin != null && pokemon.def < defMin) {
            return false
          }
          if (defMax != null && pokemon.def > defMax) {
            return false
          }
          if (spatkMin != null && pokemon.spatk < spatkMin) {
            return false
          }
          if (spatkMax != null && pokemon.spatk > spatkMax) {
            return false
          }
          if (spdefMin != null && pokemon.spdef < spdefMin) {
            return false
          }
          if (spdefMax != null && pokemon.spdef > spdefMax) {
            return false
          }
          if (spdMin != null && pokemon.spd < spdMin) {
            return false
          }
          if (spdMax != null && pokemon.spd > spdMax) {
            return false
          }
          return true
        })
      }
    }
  }

  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })
  const server = new ApolloServer({ schema: schemaWithResolvers })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  console.log(`🚀  Server ready at: ${url}`)
})()
  .then(() => { console.log('Server started...') })
  .catch((e) => { console.error(e) })

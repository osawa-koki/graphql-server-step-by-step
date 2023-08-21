import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

(async () => {
  interface Book {
    title: string;
    author: string;
  }

  const typeDefs = `
    type Book {
      title: String
      author: String
    }

    type Query {
      books: [Book]
    }
  `;

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

  const resolvers = {
    Query: {
      books: (): Book[] => books,
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})()
  .then(() => console.log('Server started...'))
  .catch((e) => console.error(e));

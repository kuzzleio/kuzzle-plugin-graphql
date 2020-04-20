'use strict';

class Resolvers {
  constructor(context) {
    this.sdk = context.accessors.sdk;

    this._resolversMap = {
      Query: {
        allBooks: async () => {
          const results = await this.sdk.document.search(
            'test-data',
            'books'
          );

          return results.hits.map((hit) => {
            return { id: hit._id, ...hit._source };
          });
        },
        book: async (root, { id }) => {
          const result = await this.sdk.document.get(
            'test-data',
            'books',
            id
          );

          return { id: result._id, ...result._source };
        },
        author: async (root, { name }) => {
          const authorResults = await this.sdk.document.search(
            'test-data',
            'authors',
            {
              query: {
                term: {
                  name,
                },
              },
            }
          );
          if (!authorResults.hits.length) {
            throw new context.errors.NotFoundError(`Couldn't find an author with name ${name}`);
          }
          const author = authorResults.hits[0];
          const books = await this.sdk.document.search(
            'test-data',
            'books',
            {
              query: {
                term: {
                  authorId: author._id,
                },
              },
            }
          );

          return {
            id: author._id,
            ...author._source,
            books: books.hits.map((hit) => {
              return { id: hit.id, ...hit._source };
            }),
          };
        },
      },
      Mutation: {
        createBook: async (root, { id, name, authorId }) => {
          const result = await this.sdk.document.create(
            'test-data',
            'books',
            { name: name, likes: 0, authorId: authorId },
            id
          );

          return { id: result._id, ...result._source };
        },
        likeBook: async (root, { id }) => {
          const book = await this.sdk.document.get('test-data', 'books', id);
          const updated = await this.sdk.document.update(
            'test-data',
            'books',
            id,
            { likes: ++book._source.likes },
            { source: true }
          );

          return { id: updated._id, ...updated._source };
        },
      },
    };
  }
  get dump() {
    return this._resolversMap;
  }
}

module.exports = Resolvers;

// See https://docs.kuzzle.io/api/1/controller-admin/load-mappings/

module.exports = {
  'test-data': {
    authors: {
      properties: {
        name: {
          type: 'keyword',
        },
      },
    },
    books: {
      properties: {
        name: {
          type: 'keyword',
        },
        likes: {
          type: 'short',
        },
        authorId: {
          type: 'keyword',
        },
      },
    },
  },
};

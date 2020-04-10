// See https://docs.kuzzle.io/api/1/controller-admin/load-fixtures/

module.exports = {
  'test-data': {
    authors: [
      { create: { _id: 'rowly' } },
      { name: 'J.K. Rowling' },
      { create: { _id: 'tolky' } },
      { name: 'J. R. R. Tolkien' },
      { create: { _id: 'empty' } },
      { name: 'Slim Shady' },
    ],
    books: [
      { create: { _id: 'hp' } },
      { name: 'Harry Potter', likes: 1, authorId: 'rowly' },
      { create: { _id: 'lotr' } },
      { name: 'Lord of the Rings', likes: 2, authorId: 'tolky' },
    ],
  },
};

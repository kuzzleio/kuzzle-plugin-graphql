
Feature: GraphQL Resolvers

    Scenario: GraphQL route exist & Introspection works
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{__type(name: \"Book\") {name}}"
        }
        """
        Then the response should be:
        """
        {"data":{"__type":{"name":"Book"}}}
        """

    Scenario: A basic request responds with all the books in db
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{allBooks{id, name}}"
        }
        """
        Then the response should be:
        """
        {"data":{"allBooks":[{"id":"hp","name":"Harry Potter"},{"id":"lotr","name":"Lord of the Rings"}]}}
        """

    Scenario: Correctly fail when asking for non-existent resolver/model
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{tables{id, name}}"
        }
        """
        Then the response should be:
        """
        {"errors":[{"message":"Cannot query field \"tables\" on type \"Query\".","locations":[{"line":1,"column":2}]}]}
        """

    Scenario: Retrieving a book by id
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{book(id: \"lotr\") {name, likes}}"
        }
        """
        Then the response should be:
        """
        {"data":{"book":{"name":"Lord of the Rings","likes":2}}}
        """

    Scenario: Correctly fail when asking for non-existent books
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{book(id: \"bad\") {name, likes}}"
        }
        """
        Then the response should be:
        """
        {"errors":[{"message":"Document \"bad\" not found.","locations":[{"line":1,"column":2}],"path":["book"]}],"data":{"book":null}}
        """

    Scenario: Creating a new book
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "mutation{createBook(id: \"hbit\", name: \"The Hobbit\", authorId: \"lotr\") {id}}"
        }
        """
        Then the response should be:
        """
        {"data":{"createBook":{"id":"hbit"}}}
        """

    Scenario: Request an author by name and their books in the same query
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{author(name: \"J.K. Rowling\") {id, name, books{name}}}"
        }
        """
        Then the response should be:
        """
        {"data":{"author":{"id":"rowly","name":"J.K. Rowling","books":[{"name":"Harry Potter"}]}}}
        """

    Scenario: Correctly fail when asking for a non-existent author
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "{author(name: \"J.K.\") {id, name, books{name}}}"
        }
        """
        Then the response should be:
        """
        {"errors":[{"message":"Couldn't find an author with name J.K.","locations":[{"line":1,"column":2}],"path":["author"]}],"data":{"author":null}}
        """

    Scenario: Modify a book's "likes" counter
        When I successfully call the GraphQL endpoint with the following body:
        """
        {
            "query": "mutation{likeBook(id: \"lotr\") {name, likes}}"
        }
        """
        Then the response should be:
        """
        {"data":{"likeBook":{"name":"Lord of the Rings","likes":3}}}
        """
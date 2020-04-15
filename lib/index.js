'use strict';

const fs = require('fs');
const path = require('path');
const Resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');

class GraphQLPlugin {
  constructor() {
    this.context = null;
    this.config = null;
    this.graphQLSchema = null;

    this.controllers = {
      graphql: {
        endpoint: 'graphQLEndpoint',
      },
    };

    this.routes = [
      {
        verb: 'post',
        url: '/graphql',
        controller: 'graphql',
        action: 'endpoint',
      },
    ];
  }

  init(customConfig, context) {
    this.config = customConfig;
    this.context = context;
    const resolvers = new Resolvers(this.context).dump;
    let typeDefs = {};

    try {
      typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');
    } catch (e) {
      throw new Error('GraphQL Plugin Error: schema file not found.');
    }

    this.graphQLSchema = makeExecutableSchema({
      typeDefs,
      resolvers,
      resolverValidationOptions: {
        requireResolversForArgs: true,
        requireResolversForNonScalar: true,
      },
    });
  }

  async graphQLEndpoint(request) {
    const body = request.input.body || {};
    const query = body.query || {};
    const vars = body.variables || {};
    const graphqlResult = await graphql(this.graphQLSchema, query, vars);

    return JSON.stringify(graphqlResult);
  }
}

module.exports = GraphQLPlugin;

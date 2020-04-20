'use strict';

const should = require('should'),
  { When, Then } = require('cucumber');

When(
  'I successfully call the GraphQL endpoint with the following body:',
  async function (data) {
    try {
      const response = await this.sdk.query({
        controller: 'kuzzle-plugin-graphql/graphql',
        action: 'endpoint',
        body: JSON.parse(data),
      });

      this.props.result = response.result;
    }
    catch (error) {
      this.props.error = error;
      throw error;
    }
  }
);

Then('the response should be:', async function (expected) {
  should(JSON.stringify(this.props.result)).be.eql(expected);
});

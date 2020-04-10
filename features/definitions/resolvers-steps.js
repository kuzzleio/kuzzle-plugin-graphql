'use strict';

const should = require('should'),
  { When, Then } = require('cucumber');

const baseRequest = {
  controller: 'kuzzle-plugin-graphql/graphql',
  action: 'endpoint',
  refresh: 'wait_for',
};

When(
  'I successfully call the GraphQL endpoint with the following body:',
  async function (data) {
    try {
      const response = await this.sdk.query({
        ...baseRequest,
        body: JSON.parse(data),
      });

      this.props.result = response.result;
    } catch (error) {
      this.props.error = error;
      throw error;
    }
  }
);

Then('the response should be:', async function (expected) {
  should(this.props.result).be.eql(expected);
});

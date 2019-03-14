const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const fs = require('fs');
const path = require('path');

/**
 * Plugins must be valid Node.js requirable modules,
 * usually shipped as a directory and containing either:
 *
 *  - an `index.js` file in its root directory, exporting a Javascript class
 *  - a well-formed `package.json` file in its root directory,
 *    specifying the path of the main requirable file in the `main` field.
 *
 * To determine the Plugin name, Kuzzle looks for the `name` field
 * in the `manifest.json` file.
 * @deprecated  - If no `manifest.json` file is found, Kuzzle will fall back
 * to the `package.json` file, if there is one. Otherwise, an exception is thrown
 * and Kuzzle will fail to start.
 *
 * @see https://docs.kuzzle.io/plugins-reference/plugins-creation-prerequisites/
 */
class CorePlugin {
  /* eslint-disable no-unused-vars */
  /* eslint-disable no-console */

  /**
   * Create a new instance of CorePlugin
   *
   * Workflow:
   *  - Kuzzle loads plugins in <kuzzle install dir>/plugins/enabled/* and
   *     instantiate them, also configuration and manifest.json files are read.
   *  - The "init" function is called
   *  - The plugin manager registers all plugin features into Kuzzle:
   *    hooks, pipes, authentication strategies and custom API routes
   *
   * Kuzzle aborts its own start sequence if any error occurs during
   * plugins initialization.
   *
   */
  constructor() {
    /**
     * The schema passed to GraphQL on every request.
     */

    this.graphQLSchema = null;

    /**
     * The plugin context is provided by Kuzzle as an argument to the
     * "init" function
     *
     * @type {PluginContext}
     */
    this.context = null;

    /**
     * Here is a good place to set default configuration values.
     * You can merge them with overridden values, provided by Kuzzle
     * as an argument to the "init" function.
     *
     * @type {Object}
     */
    this.config = {
      param: '<default value>'
    };

    /**
     * Specifies a set of events along with the asynchronous
     * listener functions they trigger.
     *
     * The function "asyncListener" will be called whenever
     * the following events are triggered:
     * - "document:beforeCreateOrReplace"
     * - "document:beforeReplace"
     * - "document:beforeUpdate"
     *
     * The function "asyncOverloadListener" will be called whenever the event
     * "core:overload" is triggered.
     *
     * @type {Object}
     *
     * @see https://docs.kuzzle.io/plugins-reference/plugins-features/adding-hooks/
     * @see https://docs.kuzzle.io/kuzzle-events/
     */
    this.hooks = {};

    /**
     * Specifies a set of events along with the synchronous
     * listener functions they trigger.
     *
     * The function "syncListener" will be called whenever the following
     * events are triggered:
     * - "document:beforeCreate"
     * - "realtime:beforePublish"
     *
     * Kuzzle will wait for these functions before continuing the request process
     *
     * @type {Object}
     *
     * @see https://docs.kuzzle.io/plugins-reference/plugins-features/adding-pipes/
     * @see https://docs.kuzzle.io/kuzzle-events/
     */
    this.pipes = {};

    /**
     * The "controllers" property enables to extend the Kuzzle API with
     * new controllers and actions
     *
     * These actions point to functions exposed to Kuzzle by the plugin.
     *
     * Any network protocol other than HTTP will be able to invoke this new
     * controller with the following JSON object:
     *
     * {
     *   controller: 'kuzzle-core-plugin-boilerplate/myNewController',
     *   action: 'myNewAction',
     *   ...
     * }
     *
     * @type {Object}
     *
     * @see https://docs.kuzzle.io/plugins-reference/plugins-features/adding-controllers/
     */
    this.controllers = {
      graphql: {
        endpoint: 'graphQLEndpoint'
      }
    };

    /**
     * The following "routes" exposed property allows Kuzzle to bind new
     * controllers and actions to HTTP endpoints
     *
     * Any parameter starting with a ':' in the URL will be made dynamic by Kuzzle.
     *
     * The first route exposes the following GET URL:
     *  https://<kuzzle server>:<port>/_plugin/kuzzle-core-plugin-boilerplate/say-something/<dynamic value>
     *
     * Kuzzle will call the function 'doSomething' with a Request object,
     * containing the "name" property: request.input.args.property = '<dynamic value>'
     *
     * The second route exposes the following POST URL:
     *  https://<kuzzle server>:<port>/_plugin/kuzzle-core-plugin-boilerplate/say-something
     *
     * Kuzzle will provide the content body of the request in the Request object
     * passed to the function 'doSomething', in the request.input.body property
     *
     * @type {Array}
     *
     * @see https://docs.kuzzle.io/plugins-reference/plugins-features/adding-controllers/
     */
    this.routes = [
      {
        verb: 'post',
        url: '/graphql',
        controller: 'graphql',
        action: 'endpoint'
      }
    ];
  }

  /**
   * Initializes the plugin with configuration and context.
   *
   * @param {Object} customConfig - This plugin custom configuration
   * @param {Object} context      - A restricted gateway to the Kuzzle API
   *
   * @see https://docs.kuzzle.io/plugins-reference/plugins-creation-prerequisites/#plugin-init-function
   * @see https://docs.kuzzle.io/plugins-reference/managing-plugins#configuring-plugins
   * @see https://docs.kuzzle.io/plugins-reference/plugins-context/
   */
  init(customConfig, context) {
    this.config = Object.assign(this.config, customConfig);
    this.context = context;

    const typeDefs = fs
      .readFileSync(path.join(__dirname, 'schema.gql'))
      .toString();

    const resolvers = {
      Query: {
        // drivers: () => {
        //   // TODO
        // },
        driver: (previous, input, ctx, info) => {
          return {
            name: 'Sirkis',
            license: 'B',
            age: 49
          };
        }
      }
    };

    this.graphQLSchema = makeExecutableSchema({
      typeDefs,
      resolvers,
      resolverValidationOptions: {
        requireResolversForArgs: true,
        requireResolversForNonScalar: true
      }
    });
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {null|string} [defaultValue]
   * @returns {string}
   *
   * @protected
   */
  getStringFromBody(request, property, defaultValue) {
    if (
      (!request.input.body || !request.input.body[property]) &&
      typeof defaultValue === 'undefined'
    ) {
      this.throwError('BadRequest', `Missing body property "${property}"`);
    }

    if (
      request.input.body[property] &&
      typeof request.input.body[property] !== 'string'
    ) {
      this.throwError(
        'BadRequest',
        `Invalid body property "${property}" value "${
          request.input.body[property]
        }"`
      );
    }

    return request.input.body[property]
      ? request.input.body[property]
      : defaultValue;
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {object} [subPropertyTypeMapping=null] Allows to map sub-property with a type, if defined, all mapped sub-properties are mandatory and no others are allowed
   * @param {object} [defaultValue]
   * @returns {object}
   *
   * @protected
   */
  getObjectFromBody(
    request,
    property,
    subPropertyTypeMapping = null,
    defaultValue
  ) {
    if (
      (!request.input.body || !request.input.body[property]) &&
      typeof defaultValue === 'undefined'
    ) {
      this.throwError('BadRequest', `Missing body property "${property}"`);
    }

    if (
      request.input.body[property] &&
      typeof request.input.body[property] !== 'object'
    ) {
      this.throwError(
        'BadRequest',
        `Invalid body property "${property} value "${
          request.input.body[property]
        }"`
      );
    }

    const value = request.input.body[property]
      ? request.input.body[property]
      : defaultValue;

    if (subPropertyTypeMapping === null) {
      return value;
    }

    if (
      !Object.keys(value).every(field =>
        Object.keys(subPropertyTypeMapping).includes(field)
      ) ||
      !Object.keys(subPropertyTypeMapping).every(
        field => typeof value[field] === subPropertyTypeMapping[field]
      )
    ) {
      this.throwError('BadRequest', `Bad sub-property in property ${property}`);
    }

    return value;
  }

  /**
   * @param {Error} error
   */
  outputError(error) {
    this.context.log.error(error.message).catch(() => {});
    this.context.log.error(error.stack).catch(() => {});
  }

  /**
   * @param {string} errorType
   * @param {string|null} [message]
   * @throws {KuzzleError}
   *
   * @protected
   */
  throwError(errorType, message) {
    throw new Error(message);
  }

  /**
   * An example of a controller function. It is called by the controller/action
   * routes defined in the `controllers` object above. It takes the request as
   * an argument and must return a Promise.
   *
   * @param {Request} request The request sent to the controller/action route
   * @return {Promise} A promise resolving the response of the route.
   *
   * @see https://docs.kuzzle.io/plugins-reference/plugins-features/adding-controllers/
   * @see https://docs.kuzzle.io/guide/essentials/request-and-response-format/
   */
  async graphQLEndpoint(request) {
    const query = this.getStringFromBody(request, 'query');
    const variables = this.getObjectFromBody(request, 'variables', null, null);

    const graphqlResult = await graphql(this.graphQLSchema, query, variables);

    if (graphqlResult.errors) {
      graphqlResult.errors.forEach(error => this.outputError(error));
    }

    const result = Buffer.from(JSON.stringify(graphqlResult));

    request.setResult(result, {
      raw: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return result;
  }
}

module.exports = CorePlugin;

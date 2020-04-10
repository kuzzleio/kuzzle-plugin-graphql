'use strict';

const { setWorldConstructor } = require('cucumber'),
  { Kuzzle, WebSocket } = require('kuzzle-sdk');

class KuzzleWorld {
  constructor(attach, parameters) {
    this.attach = attach.attach;
    this.parameters = parameters;

    this.host = process.env.KUZZLE_HOST || 'localhost';
    this.port = process.env.KUZZLE_PORT || '7512';

    this._sdk = new Kuzzle(new WebSocket(this.host, { port: this.port }));
    this.props = {};
  }

  get sdk() {
    return this._sdk;
  }
}

setWorldConstructor(KuzzleWorld);

module.exports = KuzzleWorld;

<p align="center">
  <img src="https://user-images.githubusercontent.com/2495908/79343214-710b2380-7f2e-11ea-953c-304f1f33d4c3.png"/>
</p>
<p align="center">
  <a href="https://david-dm.org/kuzzleio/kuzzle-plugin-graphql">
    <img src="https://david-dm.org/kuzzleio/kuzzle-plugin-graphql/status.svg" />
  </a>
  <a href="https://travis-ci.com/kuzzleio/kuzzle-plugin-graphql">
    <img alt="undefined" src="https://travis-ci.com/kuzzleio/kuzzle-plugin-graphql.svg?branch=master">
  </a>
  <a href="https://github.com/kuzzleio/kuzzle-plugin-graphql/blob/master/LICENSE">
    <img alt="undefined" src="https://img.shields.io/github/license/kuzzleio/kuzzle-plugin-graphql.svg?style=flat">
  </a>
</p>

## Kuzzle GraphQL Plugin

From schema to resolvers, this plugin aims to serve you as a kick-start boilerplate so you can get into wrinting your own GraphQL layer in no time.


#### Getting Started

This plugin exposes a fully functional `/graphql` route, already making the realtionship between a [schema file](lib/schema.gql) and a [resolvers](lib/resolvers.js) class.

#### Testing
Feel free to use the provided functional tests as an example for contructing your own.

You can easily run them with:

```bash
$ npm test
```

### Kuzzle

Kuzzle is an open-source backend that includes a scalable server, a multiprotocol API,
an administration console and a set of plugins that provide advanced functionalities like real-time pub/sub, blazing fast search and geofencing.

* :octocat: __[Github](https://github.com/kuzzleio/kuzzle)__
* :earth_africa: __[Website](https://kuzzle.io)__
* :books: __[Documentation](https://docs.kuzzle.io)__
* :email: __[Gitter](https://gitter.im/kuzzleio/kuzzle)__

### Get trained by the creators of Kuzzle :zap:

Train yourself and your teams to use Kuzzle to maximize its potential and accelerate the development of your projects.
Our teams will be able to meet your needs in terms of expertise and multi-technology support for IoT, mobile/web, backend/frontend, devops.
:point_right: [Get a quote](https://hubs.ly/H0jkfJ_0).

## Plugin deployment

### On a pristine Kuzzle stack

You can use the [docker-compose.yml](docker-compose.yml) file included in this repository to start a development-oriented stack to help you get started on your custom Kuzzle GraphQL plugin.

Clone this repository locally and type:

```bash
$ docker-compose up
```

This command will start a Kuzzle stack with this plugin enabled. To make development more confortable, a watcher will also be activated, restarting Kuzzle every time a modification is detected.

**Note:** depending on your operating system, you may get `ENOSPC` errors due to the file watcher. This is due to a `sysctl` restriction, and can be alleviated by applying the following command prior to starting the docker stack:

```bash
$ sudo sysctl -w fs.inotify.max_user_watches=52428
```

### On an existing Kuzzle

Clone this repository locally and make it accessible from the `plugins/enabled` directory relative to the Kuzzle installation directory. A common practice is to put the code of the plugin in `plugins/available` and create a symbolic link to it in `plugins/enabled`.

**Note.** If you are running Kuzzle within a Docker container, you will need to mount the local plugin installation directory as a volume in the container.

### Documentation

Please refer to our guides for more instructions on:

* [How Kuzzle plugins work](https://docs.kuzzle.io/core/1/guides/essentials/plugins/).
* [How to install Kuzzle plugins](http://docs.kuzzle.io/guide/essentials/plugins/#managing-plugins).
* [Develop your custom plugins with this boilerplate](https://github.com/kuzzleio/kuzzle-plugin-advanced-boilerplate)

If you need help, [ hit us up](https://hubs.ly/H0jkfJ_0).
# kuzzle-plugin-graphql

> TODO

## Install plugin

### On an existing Kuzzle

Clone this repository locally and make it accessible from the `plugins/enabled` directory relative to the Kuzzle installation directory. A common practice is to put the code of the plugin in `plugins/available` and create a symbolic link to it in `plugins/enabled`.

**Note.** If you are running Kuzzle from within a Docker container, you will need to mount the local plugin installation directory as a volume in the container.

Please refer to the Guide for further instructions on [how to install Kuzzle plugins](https://docs.kuzzle.io/guide/1/essentials/plugins/).

### On a pristine Kuzzle stack

You can use the `docker-compose.yml` file included in this repository to start a development-oriented stack to help you creating your custom Kuzzle Core plugin.

Clone this repository locally and type:

```bash
$ docker-compose -f docker/docker-compose.yml up
```

This command will start a Kuzzle stack with this plugin enabled. To make development more confortable, a watcher will also be activated, restarting Kuzzle every time a modification is detected.

**Note:** depending on your operating system, you may get `ENOSPC` errors due to the file watcher. This is due to a `sysctl` restriction, and can be alleviated by applying the following command prior to starting the docker stack:

```bash
$ sudo sysctl -w fs.inotify.max_user_watches=52428
```

#### Working on a different Kuzzle tag

You can choose to work on the Kuzzle development branch by defining the following environment variables before launching `docker-compose`:

```bash
$ export KUZZLE_DOCKER_TAG=1.4.2
$ docker-compose -f docker/docker-compose.yml up
```

These environment variables enable you to specify any existing build tag available on [Docker Hub](https://hub.docker.com/r/kuzzleio/kuzzle/tags/).

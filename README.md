## Description

This repository contains the backend services for the BDSwiss coding challange

## Installation

```bash
$ yarn install
```

## Running the app

### Docker

#### Prerequisites: [Docker](https://docs.docker.com/engine/install/), [Docker Compose](https://docs.docker.com/compose/install/)

```bash
$ docker-compose up -d
```

### Normal

Please not that you need to have a Postgres database already running

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Stay in touch

- Author - [Chrysovalantis Christodoulou](https://www.linkedin.com/in/chrysovalantis-christodoulou-094790132/)

## License

Nest is [MIT licensed](LICENSE).

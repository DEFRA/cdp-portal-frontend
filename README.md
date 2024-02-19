# CDP Portal Frontend

Portal Frontend for Core Delivery Platform (CDP)

[![Publish](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/publish.yml/badge.svg)](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/publish.yml)

[![Integration Tests](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/integration-tests.yml)

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Portal APIs](#portal-apis)
  - [Redis](#redis)
  - [Development](#development)
    - [Debugging](#debugging)
    - [Testing](#testing)
      - [Run a specific test](#run-a-specific-test)
      - [Debugging nock](#debugging-nock)
    - [Code Quality](#code-quality)
    - [Code formatting](#code-formatting)
  - [Local JSON API](#local-json-api)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
- [Docker](#docker)
  - [Development Image](#development-image)
  - [Production Image](#production-image)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v20` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd cdp-portal-frontend
nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
npm install
npm install --save-dev webpack
```

### Portal APIs

The Portal Frontend has a number of APIs it uses to perform actions on the Platform and APIs to obtain information
about the Platform and its tenants.

- [CDP Self Service Ops](https://github.com/DEFRA/cdp-self-service-ops)
- [CDP User Service Backend](https://github.com/DEFRA/cdp-user-service-backend)
- [CDP Portal Backend](https://github.com/DEFRA/cdp-portal-backend)

### Redis

The Portal Frontend uses [Redis](https://redis.io/) for session storage.
When the application is run on AWS it does so on a Redis/ElastiCache Cluster, locally it uses 1 Redis instance. To
set up Redis locally refer to the documentation found:

- [https://redis.io/docs/getting-started/installation](https://redis.io/docs/getting-started/installation)

### Development

Run the application in `development` mode run:

```bash
npm run dev
```

#### Debugging

To set up `Node.js` debugging in your IDE:

- [Running and debugging Node.js - Jet Brains](https://www.jetbrains.com/help/idea/running-and-debugging-node-js.html)

To run debug mode:

```bash
npm run dev:debug
```

#### Testing

To run all tests with coverage:

```bash
npm test
```

Or use the shortcut:

```bash
npm t
```

##### Run a specific test

To run a specific test:

```bash
npm test -i <test-path>
```

E.g:

```bash
npm test -i src/server/health/controller.test.js
```

#### Debugging nock

To see if your `nock` mocks are matching your tests calls set the following environment variable in your test
environment:

```bash
export DEBUG=nock.*
```

> For more information see [https://github.com/nock/nock#debugging](https://github.com/nock/nock#debugging)

#### Code Quality

To run code linting:

```bash
npm run lint
```

To run code lint for JavaScript:

```bash
npm run lint:js
```

To run an automatic code fix for JavaScript:

> Note this is pretty good but may also need some manual human interaction

```bash
npm run lint:fix
```

To run code lint for SASS:

```bash
npm run lint:scss
```

#### Code formatting

This code base uses Prettier to keep code formatted in a uniform way. When you first clone the repository set up
Prettier to run on save in your IDE.

- [Prettier setup - Jet Brains](https://www.jetbrains.com/help/idea/prettier.html)
- [Prettier Plugins](https://prettier.io/docs/en/plugins.html)

To check formatting changes:

```bash
npm run format:check
```

To format code:

```bash
npm run format
```

### Local JSON API

Whilst the APIs are being developed this app uses a local JSON mock API. To start this locally run:

```bash
npm run mockApi
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag cdp-portal-frontend:development .
```

Run:

```bash
docker run -p 3000:3000 cdp-portal-frontend:development
```

### Production image

Build:

```bash
docker build --no-cache --tag cdp-portal-frontend .
```

Run:

```bash
docker run -p 3000:3000 cdp-portal-frontend
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

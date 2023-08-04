# CDP Portal Frontend

Portal Frontend for CDP

[![Publish](https://github.com/defra-cdp-sandpit/cdp-portal-frontend/actions/workflows/publish.yml/badge.svg)](https://github.com/defra-cdp-sandpit/cdp-portal-frontend/actions/workflows/publish.yml)

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Portal APIs](#portal-apis)
  - [Development](#development)
  - [Basic Auth](#basic-auth)
  - [Local JSON API](#local-json-api)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
- [Versioning](#versioning)
  - [Auto minor versioning](#auto-minor-versioning)
  - [Major or Patch versioning](#major-or-patch-versioning)
- [Docker](#docker)
  - [Development Image](#development-image)
  - [Production Image](#production-image)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v18` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
$ cd cdp-portal-frontend
$ nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
$ npm install
```

### Portal APIs

- [CDP Self Service Ops](https://github.com/defra-cdp-sandpit/cdp-self-service-ops)

### Development

Run the application in `development` mode run:

```bash
$ npm run dev
```

### Basic Auth

For local development basic auth details are:

- username: `dev`
- password: `dev`

### Local JSON API

Whilst the APIs are being developed this app uses a local JSON mock API. To start this locally run:

```bash
$ npm run mockApi
```

### Production

To mimic the application running in `production` mode locally run:

```bash
$ npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
$ npm run
```

## Versioning

### Auto minor versioning

The [Publish GitHub Actions workflow](./.github/workflows/publish.yml) auto versions a Pull Requests code with a `minor`
version once it has been merged into the `main` branch.
All you have to do is commit your code and raise a Pull Request and the pipeline will auto version your code for you.

### Major or Patch versioning

If you wish to `patch` or `major` version your codebase use:

```bash
$ npm version <patch|major>
```

Then:

- Push this code with the auto generated commit to your GitHub Repository
- Raise a Pull Request
- Merge your code into the `main` branch
- The [Publish GitHub Actions workflow](./.github/workflows/publish.yml) will tag and push your `major` or `patch`
  version tags to your GitHub Repository
- The [Publish GitHub Actions workflow](./.github/workflows/publish.yml) will release your `major` or `patch`
  versioned code

## Docker

### Development image

Build:

```bash
$ docker build --target development --no-cache --tag cdp-portal-frontend:development .
```

Run:

```bash
$ docker run -p 3000:3000 cdp-portal-frontend:development
```

### Production image

Build:

```bash
$ docker build --no-cache --tag cdp-portal-frontend .
```

Run:

```bash
$ docker run -p 3000:3000 cdp-portal-frontend
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

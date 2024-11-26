# CDP Portal Frontend

The Core Delivery Platform (CDP), Portal Frontend is a web application that provides a user interface for CDP.

[![Publish](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/publish.yml/badge.svg)](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/publish.yml)
[![Integration Tests](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/DEFRA/cdp-portal-frontend/actions/workflows/integration-tests.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_cdp-portal-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_cdp-portal-frontend)

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Portal APIs](#portal-apis)
  - [Redis](#redis)
  - [Development](#development)
    - [Updating dependencies](#updating-dependencies)
    - [Debugging](#debugging)
    - [Testing](#testing)
      - [Run a specific test](#run-a-specific-test)
    - [Debugging nock](#debugging-nock)
    - [Code Quality](#code-quality)
    - [Code formatting](#code-formatting)
  - [Creating icons](#creating-icons)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
- [LocalStack](#localstack)
  - [Test reports](#test-reports)
  - [Documentation](#documentation)
  - [Terminal](#terminal)
    - [Repositories](#repositories)
  - [Set up](#set-up)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v20` and [npm](https://nodejs.org/) `>= v9`.

> [!TIP]
> To install Node.js and npm Use Node Version Manager [nvm](https://github.com/creationix/nvm)

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
set up Redis locally, refer to the documentation found:

- [https://redis.io/docs/getting-started/installation](https://redis.io/docs/getting-started/installation)

### Development

Run the application in `development` mode run:

```bash
npm run dev
```

#### Updating dependencies

To update dependencies, globally install https://www.npmjs.com/package/npm-check-updates. Then run the below script,
run tests, test the application and commit the altered `package.json` and `package-lock.json` files. For more
options around updates check the package docs.

```bash
ncu -i
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

> [!TIP]
> Or use the shortcut:
>
> ```bash
> npm t
> ```

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

### Creating icons

You can see examples of the icons used throughout the application
in [src/server/common/components/icons](src/server/common/components/icons). To create icons:

- Copy and rename an existing component from [src/server/common/components/icons](src/server/common/components/icons)
- Choose an icon from [Material Symbols](https://fonts.google.com/icons)
- The icons used already are:
  - Fill ✅
  - Weight `700`
  - Grade `200`
  - Size `48px`
- Download the SVG file
- Go to [svgomg](https://jakearchibald.github.io/svgomg/)
- Upload the SVG file
- Click Markup tab
- Copy markup and place it into an icon component
- Update CSS class names, macro name etc, to the new icons name
- Import the icon into your page, or if used globally in multiple places into
  [src/server/common/templates/layouts/page.njk](src/server/common/templates/layouts/page.njk)

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

## LocalStack

A few examples of how to use LocalStack with the Portal Frontend.

### Test reports

To generate test reports and upload them to S3 to be displayed locally in the Portal Frontend UI:

```bash
## Start localstack
docker run --pull=always -d -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack:latest

## Create S3 bucket
awslocal s3 mb s3://cdp-<environment>-test-results --endpoint-url http://localhost:4566

### fEx:
awslocal s3 mb s3://cdp-dev-test-results --endpoint-url http://localhost:4566

## Run tests

### Smoke tests
cd cdp-portal-smoke-tests
npm run report

### Perf tests
cd cdp-uploader-perf-tests
jmeter -n -t scenarios/test.jmx -e -l test.csv -o reports -j logs/log.log -f -Jenv="perf-test"

## Upload test results to S3
awslocal s3 cp <local-folder-name> s3://<s3-bucket-name/local-folder-name/> --recursive

### fEx:
awslocal s3 cp reports s3://cdp-infra-dev-test-results/cdp-portal-perf-tests/95a01432-8f47-40d2-8233-76514da2236a --recursive
awslocal s3 cp allure-report s3://cdp-infra-dev-test-results/cdp-portal-smoke-tests/5002a961-e6dd-4e7b-a544-a55c907b6b9f --recursive
```

### Documentation

To upload documentation repository to localstack S3 so it displays locally in the Portal Frontend UI:

```bash
## Start localstack
docker run --pull=always -d -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack:latest

## Create S3 bucket
awslocal s3 mb s3://cdp-documentation --endpoint-url http://localhost:4566

## Upload docs to localstack S3
git clone https://github.com/DEFRA/cdp-documentation/
cd cdp-documentation
awslocal s3 sync . s3://cdp-documentation --exclude ".editorconfig" --exclude ".github/*" --exclude ".git/*" --exclude ".gitignore" --exclude "CONTRIBUTING.md" --delete
```

### Terminal

To set up the web shell so it displays locally in the Portal Frontend UI:

#### Repositories

- Web Shell Proxy - https://github.com/DEFRA/cdp-webshell-proxy
- Web Shell - https://github.com/christopherjturner/webshell

### Set up

Either launch [Terminal in Local Environment](https://github.com/DEFRA/cdp-local-environment?tab=readme-ov-file#terminal),

or build and launch locally:

```bash
cd cdp-webshell-proxy

pip3 install -r requirements.txt
pip3 install "fastapi[standard]"

## Start proxy
fast api dev app.py

## Register a route
curl --header "Content-type: application/json" --data-raw '{"id":"12345","target":"localhost"}' 'http://localhost:8080/admin/register'

## Start the web shell
git clone https://github.com/christopherjturner/webshell

install go https://go.dev/doc/install

go run . -port 8085 -token 12345

## Open the web shell
http://localhost:8085/12345/

## De-register a route
curl http://localhost:8085/admin/deregister/12345'
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

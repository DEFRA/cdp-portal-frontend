import convict from 'convict'
import path from 'path'

import { version } from '~/package.json'

const oneWeek = 7 * 24 * 60 * 60 * 1000

const appConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeek,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  version: {
    doc: 'Application version',
    format: String,
    default: version
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'Core Delivery Platform Portal'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  appPathPrefix: {
    doc: 'Application url path prefix this is needed only until we have host based routing',
    format: String,
    default: '/cdp-portal-frontend',
    env: 'APP_PATH_PREFIX'
  },
  mockApiUrl: {
    doc: 'API root url',
    format: String,
    default: 'http://localhost:3004/mock-api',
    env: 'API_URL'
  },
  teamsAndRepositoriesApiUrl: {
    doc: 'Teams and Repositories root API url',
    format: String,
    default: 'http://localhost:3008/cdp-teams-and-repositories',
    env: 'TEAMS_AND_REPOSITORIES_API_URL'
  },
  deploymentsApiUrl: {
    doc: 'Deployments root API url',
    format: String,
    default: 'http://localhost:5094/cdp-deployments',
    env: 'DEPLOYMENTS_API_URL'
  },
  deployablesApiUrl: {
    doc: 'Deployables root API url',
    format: String,
    default: 'http://localhost:5070/cdp-portal-deployables-backend',
    env: 'DEPLOYABLES_API_URL'
  },
  selfServiceOpsApiUrl: {
    doc: 'Self Service Ops root API url',
    format: String,
    default: 'http://localhost:3009/cdp-self-service-ops',
    env: 'SELF_SERVICE_OPS_API_URL'
  },
  sessionCookiePassword: {
    doc: 'Session cookie password',
    format: '*',
    default: 'beepBoopBeepDevelopmentOnlyBeepBoop',
    sensitive: true,
    env: 'SESSION_COOKIE_PASSWORD'
  },
  basicAuthUser: {
    doc: 'Basic Auth user',
    format: '*',
    default: 'dev',
    sensitive: true,
    env: 'BASIC_AUTH_USER'
  },
  basicAuthPassword: {
    doc: 'Basic Auth password',
    format: '*',
    default: '$2a$04$9wN0ZJE/GjeNJMgNSvheS.eUXZ5AKkc5CBg1Zks4HuD8HkqVCH7Rq',
    sensitive: true,
    env: 'BASIC_AUTH_PASSWORD'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  }
})

appConfig.validate({ allowed: 'strict' })

export { appConfig }

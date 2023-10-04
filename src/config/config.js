import convict from 'convict'
import path from 'path'

import { version } from '~/package.json'

const oneDay = 1000 * 60 * 60 * 24
const oneWeek = 7 * 24 * 60 * 60 * 1000

const config = convict({
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
    default: 'Core Delivery Platform - Portal'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  appBaseUrl: {
    doc: 'Application base URL for after we login',
    format: String,
    default: 'http://localhost:3000',
    env: 'APP_BASE_URL'
  },
  appPathPrefix: {
    doc: 'Application url path prefix this is needed only until we have host based routing',
    format: String,
    default: '/cdp-portal-frontend',
    env: 'APP_PATH_PREFIX'
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/cdp-portal-frontend/public',
    env: 'ASSET_PATH'
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
  portalBackendApiUrl: {
    doc: 'Portal backend for deployments and deployables root API url',
    format: String,
    default: 'http://localhost:5094/cdp-portal-backend',
    env: 'PORTAL_BACKEND_API_URL'
  },
  selfServiceOpsApiUrl: {
    doc: 'Self Service Ops root API url',
    format: String,
    default: 'http://localhost:3009/cdp-self-service-ops',
    env: 'SELF_SERVICE_OPS_API_URL'
  },
  userServiceApiUrl: {
    doc: 'User Service Backend API url',
    format: String,
    default: 'http://localhost:3001/cdp-user-service-backend',
    env: 'USER_SERVICE_API_URL'
  },
  githubOrg: {
    doc: 'The Github Organisation',
    format: String,
    default: 'defra-cdp-sandpit'
  },
  sessionCookiePassword: {
    doc: 'Session cookie password',
    format: '*',
    default: 'beepBoopBeepDevelopmentOnlyBeepBoop',
    sensitive: true,
    env: 'SESSION_COOKIE_PASSWORD'
  },
  sessionCookieTtl: {
    doc: 'Session cookie ttl',
    format: Number,
    default: oneDay,
    env: 'SESSION_COOKIE_TTL'
  },
  redisHost: {
    doc: 'Redis cache host',
    format: String,
    default: '127.0.0.1',
    env: 'REDIS_HOST'
  },
  redisUsername: {
    doc: 'Redis cache username',
    format: String,
    default: '',
    env: 'REDIS_USERNAME'
  },
  redisPassword: {
    doc: 'Redis cache password',
    format: '*',
    default: '',
    sensitive: true,
    env: 'REDIS_PASSWORD'
  },
  useSingleInstanceCache: {
    doc: 'Enable the use of a single instance Redis Cache',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production',
    env: 'USE_SINGLE_INSTANCE_CACHE'
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
  },
  azureTenantId: {
    doc: 'Azure Active Directory Tenant ID',
    format: String,
    env: 'AZURE_TENANT_ID',
    default: '6f504113-6b64-43f2-ade9-242e05780007'
  },
  azureClientId: {
    doc: 'Azure App Client ID',
    format: String,
    env: 'AZURE_CLIENT_ID',
    default: '63983fc2-cfff-45bb-8ec2-959e21062b9a'
  },
  azureClientSecret: {
    doc: 'Azure App Client Secret',
    format: String,
    sensitive: true,
    env: 'AZURE_CLIENT_SECRET',
    default: ''
  },
  azureAdminGroupId: {
    doc: 'Azure Active Directory Admin Group',
    format: String,
    env: 'AZURE_ADMIN_GROUP_ID',
    default: 'aabe63e7-87ef-4beb-a596-c810631fc474'
  }
})

config.validate({ allowed: 'strict' })

export { config }

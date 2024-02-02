import convict from 'convict'
import path from 'path'

const oneDay = 1000 * 60 * 60 * 24
const oneWeek = 7 * 24 * 60 * 60 * 1000
const oneMonth = 4 * 7 * 24 * 60 * 60 * 1000

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
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  mockApiUrl: {
    doc: 'API root url',
    format: String,
    default: 'http://localhost:3004/mock-api',
    env: 'API_URL'
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
    default: 'DEFRA'
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
    default: oneMonth,
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
  redisKeyPrefix: {
    doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
    format: String,
    default: 'cdp-portal-frontend',
    env: 'REDIS_KEY_PREFIX'
  },
  redisTtl: {
    doc: 'Redis cache global ttl',
    format: Number,
    default: oneDay,
    env: 'REDIS_TTL'
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
  oidcWellKnownConfigurationUrl: {
    doc: 'OIDC .well-known configuration URL',
    format: String,
    env: 'OIDC_WELL_KNOWN_CONFIGURATION_URL',
    default:
      'https://login.microsoftonline.com/6f504113-6b64-43f2-ade9-242e05780007/v2.0/.well-known/openid-configuration'
  },
  oidcAdminGroupId: {
    doc: 'OIDC Admin Group ID',
    format: String,
    env: 'OIDC_ADMIN_GROUP_ID',
    default: 'aabe63e7-87ef-4beb-a596-c810631fc474'
  },
  supportChannel: {
    doc: 'Support channel url',
    format: String,
    env: 'SUPPORT_CHANNEL_URL',
    default: 'https://defra-digital-team.slack.com/archives/C05UJ3SE5C6'
  },
  platformCPUResource: {
    doc: 'The amount of CPU platform sidecars use in a deployment',
    format: Number,
    env: 'PLATFORM_PROCESS_CPU_RESOURCE',
    default: 70
  },
  platformMemoryResource: {
    doc: 'The amount of memory platform sidecars use in a deployment in MegaBytes',
    format: Number,
    env: 'PLATFORM_PROCESS_MEMORY_RESOURCE',
    default: 100
  },
  dockerHubUrl: {
    doc: 'Defra docker hub url',
    format: String,
    env: 'DOCKER_HUB_URL',
    default: 'https://hub.docker.com/r/defradigital'
  },
  truststoreCdpRootCa: {
    doc: 'CDP Root CA',
    format: String,
    env: 'TRUSTSTORE_CDP_ROOT_CA',
    default: ''
  }
})

config.validate({ allowed: 'strict' })

export { config }

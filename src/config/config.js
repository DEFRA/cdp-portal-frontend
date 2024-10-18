import path from 'node:path'
import convict from 'convict'

const oneHour = 1000 * 60 * 60
const eightHours = 1000 * 60 * 60 * 8
const oneDay = 1000 * 60 * 60 * 24
const oneYear = 52 * 7 * 24 * 60 * 60 * 1000

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = process.env.NODE_ENV === 'development'

const config = convict({
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneYear,
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
    default: path.normalize(path.resolve(__dirname, '..', '..'))
  },
  appBaseUrl: {
    doc: 'Application base URL',
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
  aws: {
    region: {
      doc: 'AWS region',
      format: String,
      default: 'eu-west-2',
      env: 'AWS_REGION'
    },
    s3: {
      endpoint: {
        doc: 'AWS S3 endpoint',
        format: String,
        default: 'http://localhost:4566',
        env: 'S3_ENDPOINT'
      },
      forcePathStyle: {
        doc: 'AWS S3 forcePathStyle option',
        format: Boolean,
        default: !isProduction
      }
    }
  },
  portalBackendUrl: {
    doc: 'Portal backend for deployments and deployables root API url',
    format: String,
    default: 'http://localhost:5094',
    env: 'PORTAL_BACKEND_URL'
  },
  selfServiceOpsUrl: {
    doc: 'Self Service Ops root API url',
    format: String,
    default: 'http://localhost:3009',
    env: 'SELF_SERVICE_OPS_URL'
  },
  userServiceBackendUrl: {
    doc: 'User Service Backend API url',
    format: String,
    default: 'http://localhost:3001',
    env: 'USER_SERVICE_BACKEND_URL'
  },
  terminalProxyUrl: {
    doc: 'Terminal Proxy Url',
    format: String,
    default: isProduction
      ? 'https://webshell.{environment}.cdp-int.defra.cloud'
      : 'http://localhost:8000',
    env: 'TERMINAL_PROXY_URL'
  },
  githubOrg: {
    doc: 'The GitHub Organisation',
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
    default: eightHours,
    env: 'SESSION_COOKIE_TTL'
  },
  nunjucks: {
    watch: {
      doc: 'Reload templates when they are changed.',
      format: Boolean,
      default: isDevelopment
    },
    noCache: {
      doc: 'Use a cache and recompile templates each time',
      format: Boolean,
      default: isDevelopment
    }
  },
  redis: {
    host: {
      doc: 'Redis cache host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_HOST'
    },
    username: {
      doc: 'Redis cache username',
      format: String,
      default: '',
      env: 'REDIS_USERNAME'
    },
    password: {
      doc: 'Redis cache password',
      format: '*',
      default: '',
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    keyPrefix: {
      doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
      format: String,
      default: 'cdp-portal-frontend:',
      env: 'REDIS_KEY_PREFIX'
    },
    ttl: {
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
    }
  },
  featureToggles: {
    keyPrefix: {
      doc: 'Key prefix for feature toggles',
      format: String,
      default: 'feature-toggle:',
      env: 'FEATURE_TOGGLE_PREFIX'
    },
    ttl: {
      doc: 'TTL for feature toggles',
      format: Number,
      default: oneHour,
      env: 'FEATURE_TOGGLE_TTL'
    },
    segment: {
      doc: 'Isolate cached items within the cache partition',
      format: String,
      default: 'feature-toggle',
      env: 'FEATURE_TOGGLE_SEGMENT'
    }
  },
  serverCacheSegment: {
    doc: 'Isolate cached items within the cache partition',
    format: String,
    default: 'session',
    env: 'SERVER_CACHE_SEGMENT'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: isDevelopment
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: isTest
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: !isTest,
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: isProduction ? 'info' : 'debug',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    }
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
    doc: 'Azure App Client Secret. Defaults to stub secret',
    format: String,
    sensitive: true,
    env: 'AZURE_CLIENT_SECRET',
    default: 'test_value'
  },
  oidcWellKnownConfigurationUrl: {
    doc: 'OIDC .well-known configuration URL. Defaults to the stub',
    format: String,
    env: 'OIDC_WELL_KNOWN_CONFIGURATION_URL',
    default:
      'http://cdp.127.0.0.1.sslip.io:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration'
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
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  audit: {
    enabled: {
      doc: 'Enable sending audit events to the CDP auditing stack',
      format: Boolean,
      default: false,
      env: 'CDP_AUDIT_ENABLED'
    },
    stream: {
      doc: 'AWS Firehose stream to send audit events to',
      format: String,
      default: 'cdp-firehose-audit',
      env: 'CDP_AUDIT_STREAM'
    },
    firehoseEndpoint: {
      doc: 'Override for testing aws firehose with localstack',
      format: String,
      nullable: true,
      default: null,
      env: 'AWS_FIREHOSE_ENDPOINT'
    },
    source: {
      doc: 'Audit source, typically your services name',
      format: String,
      default: 'cdp-portal-frontend',
      env: 'AUDIT_SOURCE'
    }
  },
  platformGlobalSecretKeys: {
    doc: 'Global Platform level secret keys. These keys are not to be overridden',
    format: Array,
    default:
      'SQUID_USERNAME,SQUID_PASSWORD,REDIS_USERNAME,REDIS_PASSWORD,REDIS_KEY_PREFIX,CDP_HTTP_PROXY,CDP_HTTPS_PROXY,HTTP_PROXY,HTTPS_PROXY',
    env: 'PLATFORM_GLOBAL_SECRET_KEYS'
  },
  enableSecureContext: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  documentation: {
    bucket: {
      doc: 'S3 bucket holding cdp-documentation docs',
      format: String,
      default: 'cdp-documentation',
      env: 'CDP_DOCUMENTATION_BUCKET'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }

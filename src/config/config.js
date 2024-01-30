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
  cdpCaCerts: {
    doc: 'Base64 encoded cdp-ca-certs.crt - (openssl base64 -e -A -in cdp-ca-certs.crt -out one-line-base64.txt)',
    format: String,
    default:
      'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCekNDQWUrZ0F3SUJBZ0lRTzJnTmUva0l2N0pBR2JnV1hiN1BCREFOQmdrcWhraUc5dzBCQVFzRkFEQVcKTVJRd0VnWURWUVFERXd0RFUwTWdVbTl2ZENCRFFUQWVGdzB4T1RBNE1qY3hPREUxTkRGYUZ3MHpPVEE0TWpjeApPREkxTkRGYU1CWXhGREFTQmdOVkJBTVRDME5UUXlCU2IyOTBJRU5CTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGCkFBT0NBUThBTUlJQkNnS0NBUUVBckV6OTAvUEkvKzdLd3JwWUhJQ0ZTNkFYUWp2cytNb2hWVlA5bCtiSkpkcUwKcjB0MFVWazVLQVA4b0lwaE90eU1sMEhBc2ZqL040bVJYQkNiODF6SjJKcWpWSXBIVW16N1VrODBjSG1jQ1dvUApvZTJoci92azVmWVQ0R3Z2ck9XeDRZbDBlWjBJMUdxdHk5aXVXQ0lYbzRvSXpPa2luTlE3ZFdqOXRtTlpnOERzCnhCbWd2WEpVbUdOd1dKclo1WXF4NmZYV3ZIOFJQdlNWTmhhUTcvUU9JRmNjYVRFWkhydEVYT2sxdTdCLzB1WjIKZ0htRmRvWm1Ldm5SYk5HenArM3IyQzBBVEc3T2tvZzRqcURqaE41Y2FPOC96SWVTWTR2VDRwTGZrbVdaTFh6YwpBL1VtdjFEeC8rdXpMSGgvVjZGWHE1RUJNNSswM0RhTmNHcDhEK3VRWXdJREFRQUJvMUV3VHpBTEJnTlZIUThFCkJBTUNBWVl3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFkQmdOVkhRNEVGZ1FVY0oxa1ZFZ05SVkcvb2grbWJFeWkKMlRySldLNHdFQVlKS3dZQkJBR0NOeFVCQkFNQ0FRQXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBRFFGWFphUwpZcUx4Nzc2ckluVjBSNWg2SDhIdnhsZ2VqY2EweWVpS0Z2N2NKRDRNbkI2d3duU200MlBmWVRtcUVGdjB2djNxClZkQmRJRm1nWVdDMnk3blY2UUZoYVBkV0hhQk1ZZnpPUWJCSzZTdFA5bzNjRy9yODJrUUJtdDVYQjhvTk1NM0UKUFM3c2RzNDl2Vm52OVRUdFlRMHlTR0FnY2FIZlVsVXp4VVNtUHQ0K2NKT2ZqMlpLV0VCaWVjdm9uY3VFcXVXRQo1KzBxa092Mk5laDhmcjZaeFByN3ZaQzBDNkdJcVRLTXhHckZTbDBuNFl6UlliNkRZRlhnTEZtUEhwNFFTYXQvCm5laFBKYVZMMWpRN0RlWU82K1ZZZ29URGFwUlA3N0hjSzk5SGNFNEM4VUJkUFR0ejFscCtiTE1RY2FPR3dadTkKQm9reDNhWUhjTjhBR2JBPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlESERDQ0FnU2dBd0lCQWdJUkFMaTJVa3IzSW5zalVJVTZlT2JDTTlzd0RRWUpLb1pJaHZjTkFRRUxCUUF3CkZqRVVNQklHQTFVRUF3d0xRMFJRSUZKdmIzUWdRMEV3SGhjTk1qTXdOekkyTURjeU1UQTFXaGNOTXpNd056STIKTURneU1UQTFXakFWTVJNd0VRWURWUVFEREFwd2RXSnNhV011WTJSd01JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQWkyQk1GVkhjdVZPdEx6MC9ad1Z0djloZEh5d2RJRzcyb1RBaDRkcnFHQi92ClZFcEZ4cURXYnNyTGExM3lXeC9oVURZRG5Xdy8rTlpPZjlDZHN1V2JHelRzbklPaHRHWEoyc0Zzd1lJWU9TbjQKSlgzTW55WXhiNldtbEFGZUhRMkQvcE45VVNOb1NTN010cDJ3eFRMejlrSFE5V0h1TnpNaEF5cVdJMFFEcjdCVQpVQ1NRd0ZYUjM0QXU4MnF4cWVReUJpcDRqd3NsNWNzOG9HdVd3RzNsRHkraFZ2SnFHaGk2Y0NJUVk4V0wva0JnCmlPS0NST3hKbTh5VmlrRDBDNVpyUVJaaXBpM29uKzI3aXVxQ2xjMkkwSFFmcmNrTDlGTHl4NXM0VVEyeGxnWS8KNW8xeTRPSTJSeld2cjViT2ZIYkpoeUZHUU9IV0FGOFRkVHl5M0dLVDNRSURBUUFCbzJZd1pEQVNCZ05WSFJNQgpBZjhFQ0RBR0FRSC9BZ0VBTUI4R0ExVWRJd1FZTUJhQUZIUkNGVjNFMGVvZWtaLzltelRuNmRLdWZkTHhNQjBHCkExVWREZ1FXQkJRSGtJSzdRYjFPT3JMb0Q2Q1dCcnpyK3Rpc3RqQU9CZ05WSFE4QkFmOEVCQU1DQVlZd0RRWUoKS29aSWh2Y05BUUVMQlFBRGdnRUJBRW55ZVpoaFZzVmdaNHE1VXZIbkM1angxZFE3SlhDbVFobWk2QXl6WmZYcAp2Q0M0TWxJdzN3dUNISTNkOFZ5czNuam1xNTZ5dk5rM1lidnozY29maUxQTGM0b1A3dUhEYnZkb1RPTC8wdUZvCnZPMEdvWCtpeHpkYXplMFRXWGQ1RDV0cGtyV3pHdlAvd1FSUm9iSDQ2WkdPUzNoYktXOXpIWVB0cVBTNDZscEIKZlVQWnVBaklSYnMvSFlGeDc2UzNJYjdhSGk4dmdTOTZsWGhYbG93eHZ2bUFKZi9rZ3JOMHRzdHYxRkFuSzhTUwpuVTlVUUlLS2pDbTZkdDBBU3BzZTR6KzVqUnNaTjUxM3ZsVTlHRkZmMjNTVFMydm95VSs4eEh2ZnBQYlhFaUt0CktLendCUEJVL2ZKM29oVjBVa0t0UDE0bGhTTnZVZStWc1l2cFZSRUJvTUE9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMrRENDQWVDZ0F3SUJBZ0lRV1E2WFJWdVEvdTVZVG5FUkJUOVBVVEFOQmdrcWhraUc5dzBCQVFzRkFEQVcKTVJRd0VnWURWUVFEREF0RFJGQWdVbTl2ZENCRFFUQWVGdzB5TXpBM01qWXdOakF5TXpkYUZ3MHpOREEzTWpZdwpOekF5TXpkYU1CWXhGREFTQmdOVkJBTU1DME5FVUNCU2IyOTBJRU5CTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGCkFBT0NBUThBTUlJQkNnS0NBUUVBc1FpYndXVVhNRFVkclJRS3c2TEs4QlhyM2huMlo2cEh3QXBERzlsekxQczMKMTQ1NDFIcEpEb0FnWGpzMXQ1NExoM2tTZDJSNm0ySlZZTjduVU51dURkbGk5aTU3SERzdlpsSWllYXVBc253VAovM0FFNVlSVmpwbTFHNzgwUDBVeElzNWNqUklJbVJRWmhFazJXMWs3TVI4NWViTUJVelFJbTdiUUZwZXJCL0NVCkJkRXpNUVR0T0RvaGUxNVdmV1MvUVhNM3EybFJwUU1GZ04xa0FOV3I5TnlmTkNsZ3kzdzRoU0xkb0RPRHBZdWMKYUwvUEsxWjRPdk4yVWF2YnNBU2taWkdES2k0ZnJ0OTFEQ3VPekQrREo0d3NyOFNaYmR2T2xaN2VaVGxxSENlbApFK1hWbWhjcWRaVVhMZjBRYUJhc3Ruam9OYXk0Zkg5Y2V2OUkwKzRWSndJREFRQUJvMEl3UURBUEJnTlZIUk1CCkFmOEVCVEFEQVFIL01CMEdBMVVkRGdRV0JCUjBRaFZkeE5IcUhwR2YvWnMwNStuU3JuM1M4VEFPQmdOVkhROEIKQWY4RUJBTUNBWVl3RFFZSktvWklodmNOQVFFTEJRQURnZ0VCQURxNzJsOWx5YXhlbFJ1azlzeHNwV0V4TXgzaQp5ZDVSOU83K282K0hOZHd4Q0ZXcmxHbFlyM1NsemxTZFdzcmYxVXRIZmpjcjRrb2JDbUZMRVBJTXRRa3FkUWR4CmNZZmp1SyszMmRqVTZ4dGR1SmVlTE9kUmpmWVN4V3VkK1hmVEtyZ3Qxem1vQ1lwZkYzQzZjZHZHZDdLYXlBMkwKNm41SDd5UjFpN2JGQm9iUEVxZUlDK2xFNDhNb1N5UWpKVS91enFsMDJHRFB5dmhQVndUM1JNdmNjSERvemxYeQptK3lpT095ZTZQWURLT1dGTmk2MXFmeDZ2ZGNYYVR5bllySlVhVTU5N0VCTlFzTkxoS25iWTVRbE5DcmpOaEFrCng4VG9vWDJ5WEl5K3pLWGhKSE1URDJqRGRjYU1RbmdpVTZOa3dya0UzQzZSWUw3R2lVUHMrVTRPYkxjPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlESGpDQ0FnYWdBd0lCQWdJUVB1cnBhZnVZWUw5MmhCM080MkNqd3pBTkJna3Foa2lHOXcwQkFRc0ZBREFXCk1SUXdFZ1lEVlFRRERBdERSRkFnVW05dmRDQkRRVEFlRncweU16QTNNall3TnpJeE1EVmFGdzB6TXpBM01qWXcKT0RJeE1EVmFNQmd4RmpBVUJnTlZCQU1NRFhCeWIzUmxZM1JsWkM1alpIQXdnZ0VpTUEwR0NTcUdTSWIzRFFFQgpBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRQ1ZFNEhpcUdlYXRNTmdBTjJFbElqcG1STXorWTdLQUZNSEZjdEVrODhpClBFKzJpTGZoRzJGcEFjdTk4Zm9EZll4TGlleUlNVlhRdlNXdlFYS0sxUS9lT0hXQVAvYWh5TTU4dERtWmVGNy8KRndOckU1dWpVQ2hQRHRBQVlLRC9GRVJRVS9qb2ltNTBoWDZqZVNUdUZtaFBUTnhCeExFbms1aGVsd0pGSGt6bQp3Z3Foblo5Nm50dHAxYlFMR3dTbUJZZkd6K1Z5MlN3SE1lVE93a0NtSEU2bjY3K0QrZE5zaklEemJZSnQxWjZLCk9NM09jNlVvQnVTNlZTbzVGblc1M1liV1ZuRjM4d1hyZDJOWFE1SGpROThxdE5aa3cvYmM3V005QU1vekxlOU0KYlZ4dzNsWjNTZFJIZkM4aENUZXhGVFBZM0o2dnVjRFdBZ08vRzVKMUJLOGpBZ01CQUFHalpqQmtNQklHQTFVZApFd0VCL3dRSU1BWUJBZjhDQVFBd0h3WURWUjBqQkJnd0ZvQVVkRUlWWGNUUjZoNlJuLzJiTk9mcDBxNTkwdkV3CkhRWURWUjBPQkJZRUZMMWJBRTh0MUY4d0w2VnBHVE00U1BJS282aC9NQTRHQTFVZER3RUIvd1FFQXdJQmhqQU4KQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBUUwzN0FJQmpUbnVOdGdFalNjS21YeVc1RWdEa0RSbGtVaFh6WGl0Rwo3UTRDZHBJTi9JQXdBaTY4cDViWnFvMVFWbno2a2hrQ2NXVER1eXBRa0J1YVBSeXA4QjFqcDZPSWd1MisrcXhxCnN5QkloUXoycmxVWllHbG5wQWlHNmw5VFdqaDMxRmw4UjBkMzRDL2lyUjhEVUFKZzZyeEVCR3VOcHVDUS9mU3gKaGpGb09wSktyZmVJanBqbVBkZ0RiOE9oeGFJK1piVTNMQmVxQ1B2b0NjVnlibWdFRkV0b1QrWFdNdHdWU1orOAprWmZWYkxBcmRMK29Xa1dXbkkxR2hjMTdlV2pmS1JidHJ2T0FNMzNIL2JqclVRd0YxUkhYckhNM3dBNWdtZStrCmVIdmxnNHpBaU0vQUNtV2txcVNtQmJ0Z3dqQkk2NExYZ1BlaHVuQU5nNlZ4SlE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDK0RDQ0FlQ2dBd0lCQWdJUVdRNlhSVnVRL3U1WVRuRVJCVDlQVVRBTkJna3Foa2lHOXcwQkFRc0ZBREFXCk1SUXdFZ1lEVlFRRERBdERSRkFnVW05dmRDQkRRVEFlRncweU16QTNNall3TmpBeU16ZGFGdzB6TkRBM01qWXcKTnpBeU16ZGFNQll4RkRBU0JnTlZCQU1NQzBORVVDQlNiMjkwSUVOQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQXNRaWJ3V1VYTURVZHJSUUt3NkxLOEJYcjNobjJaNnBId0FwREc5bHpMUHMzCjE0NTQxSHBKRG9BZ1hqczF0NTRMaDNrU2QyUjZtMkpWWU43blVOdXVEZGxpOWk1N0hEc3ZabElpZWF1QXNud1QKLzNBRTVZUlZqcG0xRzc4MFAwVXhJczVjalJJSW1SUVpoRWsyVzFrN01SODVlYk1CVXpRSW03YlFGcGVyQi9DVQpCZEV6TVFUdE9Eb2hlMTVXZldTL1FYTTNxMmxScFFNRmdOMWtBTldyOU55Zk5DbGd5M3c0aFNMZG9ET0RwWXVjCmFML1BLMVo0T3ZOMlVhdmJzQVNrWlpHREtpNGZydDkxREN1T3pEK0RKNHdzcjhTWmJkdk9sWjdlWlRscUhDZWwKRStYVm1oY3FkWlVYTGYwUWFCYXN0bmpvTmF5NGZIOWNldjlJMCs0Vkp3SURBUUFCbzBJd1FEQVBCZ05WSFJNQgpBZjhFQlRBREFRSC9NQjBHQTFVZERnUVdCQlIwUWhWZHhOSHFIcEdmL1pzMDUrblNybjNTOFRBT0JnTlZIUThCCkFmOEVCQU1DQVlZd0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFEcTcybDlseWF4ZWxSdWs5c3hzcFdFeE14M2kKeWQ1UjlPNytvNitITmR3eENGV3JsR2xZcjNTbHpsU2RXc3JmMVV0SGZqY3I0a29iQ21GTEVQSU10UWtxZFFkeApjWWZqdUsrMzJkalU2eHRkdUplZUxPZFJqZllTeFd1ZCtYZlRLcmd0MXptb0NZcGZGM0M2Y2R2R2Q3S2F5QTJMCjZuNUg3eVIxaTdiRkJvYlBFcWVJQytsRTQ4TW9TeVFqSlUvdXpxbDAyR0RQeXZoUFZ3VDNSTXZjY0hEb3psWHkKbSt5aU9PeWU2UFlES09XRk5pNjFxZng2dmRjWGFUeW5ZckpVYVU1OTdFQk5Rc05MaEtuYlk1UWxOQ3JqTmhBawp4OFRvb1gyeVhJeSt6S1hoSkhNVEQyakRkY2FNUW5naVU2Tmt3cmtFM0M2UllMN0dpVVBzK1U0T2JMYz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQotLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0KTUlJREhEQ0NBZ1NnQXdJQkFnSVFHZkNVeFpMMERNL0JwdDhVKzNqYTdUQU5CZ2txaGtpRzl3MEJBUXNGQURBVwpNUlF3RWdZRFZRUUREQXREUkZBZ1VtOXZkQ0JEUVRBZUZ3MHlNekEzTWpZd056SXhNRFZhRncwek16QTNNall3Ck9ESXhNRFZhTUJZeEZEQVNCZ05WQkFNTUMzQnlhWFpoZEdVdVkyUndNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUYKQUFPQ0FROEFNSUlCQ2dLQ0FRRUEybGtvRTZWSHd0ZGZ3cnYyQzhuUHZwTFViVnFxdmkwU0dJRldwVktMcjMwcQp3UXhRc1VjSEtKU1dwRlNkc0F6VTBrdjNoMGhidXpOMG90UHd6RVUwVnAxZDFFVEdyS2pJejFtN3J5dDg4UXlrCnYxRGZCWG4xeU1tRUtkKzBwQ1VkM3BibmYwbjRjNFRsRldJdU9mL2Q1S2xVNjB6d1BjTFJmajZnd1JXY0NsNFkKaEp1UFhzTThWU2MzdUdhM2lKNjZib1dIVWUrYVhaZFd0bHF1eHU4QTArS1oxM2VHRnBDRmN0SS9DdWluaXVXWgoydGVxRy9zUHpCZjhnZEdjS3FUbkQ2Nzl5OU0veXh0NVJMVW9zREhZUW5VRVlSLzFIYWFpZUxkN2FFSHFzSlU0Ckt1UGZOSU1KeGNYZWpQUzZuWEp4aGdPQm9XSzh2c2FIU29CcWd3YWdWd0lEQVFBQm8yWXdaREFTQmdOVkhSTUIKQWY4RUNEQUdBUUgvQWdFQU1COEdBMVVkSXdRWU1CYUFGSFJDRlYzRTBlb2VrWi85bXpUbjZkS3VmZEx4TUIwRwpBMVVkRGdRV0JCUTJucThCcWlJWk9GbGxpNXZwdzFaUDIvTWtqekFPQmdOVkhROEJBZjhFQkFNQ0FZWXdEUVlKCktvWklodmNOQVFFTEJRQURnZ0VCQUJ5UVJoNlNsOC9QT0p0U2ExYUMyRjRIL09wS1NrMlBXd3FSNnFoZ2JkRnkKek1ETmVMUUI1WDBKdVA5bmQvOVBTRitFN2lYbnVORWNGMXVNR3ZCa0R1aHNVRkF4akp0T0tSWEFvVlVlQ3BVcwp4VVUzNmdCTXlYVUN5Tm1BR2Q3WVhoRkVaVW9CRk1JakNVd0JXRG9SRlRnaDIwTXJtZ2dFdktnMUNoM2hyYXgrCkNNVU9MNmc1UUpxL3V6QXp4bGVNREtpQ25QYkN5R1FYUUJyMi9KV0RaL0pIaEZCZ0Y2ZWhDK2g0R3hCV1prWGsKWWMzdysrMDZtdHJETXl2OElxd01sWjFZc2lNL0tFY29hY1p2VEFQR1hONXllNTFmZGV3emVsNG9zN2hxOENEWApuMkp5ZzRaWkIxUjZNZzdEeFptOGVDRnhTajBqRHNWdkZBMVdWWk52MjM4PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDK0RDQ0FlQ2dBd0lCQWdJUVdRNlhSVnVRL3U1WVRuRVJCVDlQVVRBTkJna3Foa2lHOXcwQkFRc0ZBREFXCk1SUXdFZ1lEVlFRRERBdERSRkFnVW05dmRDQkRRVEFlRncweU16QTNNall3TmpBeU16ZGFGdzB6TkRBM01qWXcKTnpBeU16ZGFNQll4RkRBU0JnTlZCQU1NQzBORVVDQlNiMjkwSUVOQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQXNRaWJ3V1VYTURVZHJSUUt3NkxLOEJYcjNobjJaNnBId0FwREc5bHpMUHMzCjE0NTQxSHBKRG9BZ1hqczF0NTRMaDNrU2QyUjZtMkpWWU43blVOdXVEZGxpOWk1N0hEc3ZabElpZWF1QXNud1QKLzNBRTVZUlZqcG0xRzc4MFAwVXhJczVjalJJSW1SUVpoRWsyVzFrN01SODVlYk1CVXpRSW03YlFGcGVyQi9DVQpCZEV6TVFUdE9Eb2hlMTVXZldTL1FYTTNxMmxScFFNRmdOMWtBTldyOU55Zk5DbGd5M3c0aFNMZG9ET0RwWXVjCmFML1BLMVo0T3ZOMlVhdmJzQVNrWlpHREtpNGZydDkxREN1T3pEK0RKNHdzcjhTWmJkdk9sWjdlWlRscUhDZWwKRStYVm1oY3FkWlVYTGYwUWFCYXN0bmpvTmF5NGZIOWNldjlJMCs0Vkp3SURBUUFCbzBJd1FEQVBCZ05WSFJNQgpBZjhFQlRBREFRSC9NQjBHQTFVZERnUVdCQlIwUWhWZHhOSHFIcEdmL1pzMDUrblNybjNTOFRBT0JnTlZIUThCCkFmOEVCQU1DQVlZd0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFEcTcybDlseWF4ZWxSdWs5c3hzcFdFeE14M2kKeWQ1UjlPNytvNitITmR3eENGV3JsR2xZcjNTbHpsU2RXc3JmMVV0SGZqY3I0a29iQ21GTEVQSU10UWtxZFFkeApjWWZqdUsrMzJkalU2eHRkdUplZUxPZFJqZllTeFd1ZCtYZlRLcmd0MXptb0NZcGZGM0M2Y2R2R2Q3S2F5QTJMCjZuNUg3eVIxaTdiRkJvYlBFcWVJQytsRTQ4TW9TeVFqSlUvdXpxbDAyR0RQeXZoUFZ3VDNSTXZjY0hEb3psWHkKbSt5aU9PeWU2UFlES09XRk5pNjFxZng2dmRjWGFUeW5ZckpVYVU1OTdFQk5Rc05MaEtuYlk1UWxOQ3JqTmhBawp4OFRvb1gyeVhJeSt6S1hoSkhNVEQyakRkY2FNUW5naVU2Tmt3cmtFM0M2UllMN0dpVVBzK1U0T2JMYz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo='
  }
})

config.validate({ allowed: 'strict' })

export { config }

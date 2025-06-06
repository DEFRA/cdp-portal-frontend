import capitalize from 'lodash/capitalize.js'
import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { validate as uuidValidate } from 'uuid'

import { createServer } from '~/src/server/index.js'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/fetch-test-runs.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import {
  fetchEntity,
  fetchEntityStatus
} from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { fetchApiGateways } from '~/src/server/services/helpers/fetch/fetch-api-gateways.js'
import { fetchRunningServices } from '~/src/server/common/helpers/fetch/fetch-running-services.js'
import { fetchAllBuckets } from '~/src/server/services/helpers/fetch/fetch-all-buckets.js'
import { fetchAvailableMigrations } from '~/src/server/services/helpers/fetch/fetch-available-migrations.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { fetchShutteringUrls } from '~/src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { availableMigrationsFixture } from '~/src/__fixtures__/migrations/available-migrations.js'
import { latestMigrationsFixture } from '~/src/__fixtures__/migrations/latest-migrations.js'
import { apiGatewaysFixture } from '~/src/__fixtures__/api-gateways.js'
import { shutteringUrlsFixture } from '~/src/__fixtures__/shuttering/shuttering-urls.js'

export const mockTeam = {
  teamId: 'mock-team-id',
  name: 'Mock Team'
}

async function mockCsrfToken(server) {
  await server.register({
    plugin: {
      name: 'mock-crumb',
      version: '1.0.0',
      register: (svr) => {
        svr.ext('onPostAuth', (request, h) => {
          request.plugins.crumb = 'test-token'
          return h.continue
        })
      }
    }
  })
}

export async function initialiseServer() {
  const inMemoryCache = [
    {
      name: 'session',
      engine: new CatboxMemory()
    },
    {
      name: 'featureToggles',
      engine: new CatboxMemory()
    }
  ]
  const server = await createServer({
    cache: inMemoryCache
  })

  await mockCsrfToken(server)

  await server.initialize()
  return server
}

function mockRepositoryCall(repositoryName, additionalTopics) {
  fetchRepository.mockResolvedValue?.({
    repositoryName,
    description: 'Mock service description',
    createdAt: '2016-12-05T11:21:25+00:00',
    url: `https://github.com/DEFRA/${repositoryName}`,
    topics: ['cdp', ...additionalTopics],
    primaryLanguage: 'JavaScript',
    teams: [mockTeam]
  })
}

export function mockBucketsCall(repositoryName) {
  fetchAllBuckets.mockResolvedValue?.({
    buckets: [
      {
        service: `${repositoryName}`,
        environment: 'infra-dev',
        bucket: 'SERVICE_BUCKET'
      },
      {
        service: `${repositoryName}`,
        environment: 'infra-dev',
        bucket: 'z_ordered_bucket'
      },
      {
        service: `${repositoryName}`,
        environment: 'dev',
        bucket: 'some_bucket'
      },
      {
        service: `${repositoryName}`,
        environment: 'dev',
        bucket: 'some_other_bucket'
      }
    ]
  })
}

export function mockTenantServicesCall(isPostgresService = false) {
  fetchTenantService.mockResolvedValue?.({
    prod: {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    'perf-test': {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    dev: {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    test: {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    management: {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    'infra-dev': {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    },
    'ext-test': {
      serviceCode: 'CDP',
      zone: 'protected',
      postgres: isPostgresService
    }
  })
}

function mockTestSuiteEntityCall(repositoryName) {
  fetchEntity.mockResolvedValue?.({
    name: repositoryName,
    type: 'TestSuite',
    subType: 'Journey',
    primaryLanguage: 'JavaScript',
    created: '2016-12-05T11:21:25Z',
    creator: null,
    teams: [mockTeam],
    status: 'Success',
    decommissioned: null
  })
}

export function mockServiceEntityCall(
  repositoryName,
  frontendOrBackend,
  status = 'Created'
) {
  fetchEntity.mockResolvedValue?.({
    name: repositoryName,
    type: 'Microservice',
    subType: capitalize(frontendOrBackend),
    primaryLanguage: 'JavaScript',
    created: '2024-12-05T11:21:25Z',
    creator: null,
    teams: [mockTeam],
    status,
    decommissioned: null
  })
}

export function mockServiceEntityStatusCall(
  repositoryName,
  frontendOrBackend,
  status = 'Created'
) {
  fetchEntityStatus.mockResolvedValue?.({
    entity: {
      name: repositoryName,
      type: 'Microservice',
      subType: capitalize(frontendOrBackend),
      primaryLanguage: 'JavaScript',
      created: '2024-12-05T11:21:25Z',
      creator: null,
      teams: [mockTeam],
      status,
      decommissioned: null
    },
    resources: {
      Repository: true,
      NginxUpstreams: false,
      SquidProxy: false,
      AppConfig: true,
      TenantServices: false,
      GrafanaDashboards: false
    }
  })
}

export function mockTestRuns(repositoryName) {
  fetchTestRuns.mockResolvedValue?.({
    testRuns: [
      {
        runId: '3ec0b267-e513-4dd1-a525-8a3a798a9c4b',
        testSuite: repositoryName,
        environment: 'infra-dev',
        cpu: 0,
        memory: 0,
        user: {
          id: '90552794-0613-4023-819a-512aa9d40023',
          displayName: 'Test, User'
        },
        deployment: null,
        created: '2024-11-01T12:59:56.102Z',
        taskArn:
          'arn:aws:ecs:eu-west-2:12334656:task/infra-dev-ecs-public/19abc1234564a009128875ffa6b9047',
        taskStatus: 'finished',
        taskLastUpdated: '2023-11-01T14:29:53.102Z',
        testStatus: 'passed',
        tag: '0.11.0',
        failureReasons: [],
        configVersion: null
      }
    ],
    page: 1,
    pageSize: 10,
    totalPages: 1
  })
}

export function mockCommonTestSuiteCalls(repositoryName) {
  mockRepositoryCall(repositoryName, ['test-suite', 'journey'])
  mockTestSuiteEntityCall(repositoryName)
}

function mockAvailableVersions() {
  fetchAvailableVersions.mockResolvedValue?.([
    {
      tag: '0.172.0',
      created: '2023-11-02T12:59:56.102Z'
    },
    {
      tag: '0.171.0',
      created: '2023-11-01T12:27:57.452Z'
    },
    {
      tag: '0.170.0',
      created: '2023-11-01T10:43:15.125Z'
    },
    {
      tag: '0.3.0',
      created: '2025-04-28T12:22:32.164Z'
    },
    {
      tag: '0.2.0',
      created: '2025-04-28T12:22:31.767Z'
    },
    {
      tag: '0.1.0',
      created: '2025-04-28T12:22:30.722Z'
    }
  ])
}

function mockFetchShutteringUrlsCall(repositoryName) {
  fetchShutteringUrls.mockResolvedValue?.(shutteringUrlsFixture(repositoryName))
}

function mockApiGatewaysCall(repositoryName) {
  fetchApiGateways.mockResolvedValue?.(apiGatewaysFixture(repositoryName))
}

function mockWhatsRunningWhereCall(repositoryName) {
  fetchRunningServices.mockResolvedValue?.([
    {
      environment: 'dev',
      service: repositoryName,
      version: '0.1.0',
      cpu: '1024',
      memory: '2048',
      instanceCount: 1,
      status: 'running',
      created: '2023-12-14T14:10:49Z'
    },
    {
      environment: 'test',
      service: repositoryName,
      version: '0.3.0',
      cpu: '1024',
      memory: '2048',
      instanceCount: 2,
      status: 'requested',
      created: '2023-12-14T14:10:49Z'
    },
    {
      environment: 'perf-test',
      service: repositoryName,
      version: '0.3.0',
      cpu: '1024',
      memory: '2048',
      instanceCount: 2,
      status: 'stopped',
      created: '2025-03-14T14:10:49Z'
    },
    {
      environment: 'prod',
      service: repositoryName,
      version: '0.3.0',
      cpu: '1024',
      memory: '2048',
      instanceCount: 2,
      status: 'failed',
      created: '2025-02-14T14:10:49Z'
    }
  ])
}

function mockFetchAvailableMigrations(repositoryName) {
  fetchAvailableMigrations.mockResolvedValue?.(
    availableMigrationsFixture(repositoryName)
  )
}

function mockFetchLatestMigrations(repositoryName) {
  fetchLatestMigrations.mockResolvedValue?.(
    latestMigrationsFixture(repositoryName)
  )
}

export function mockServicesAdditionalCalls({
  repositoryName,
  frontendOrBackend,
  isPostgresService
}) {
  mockRepositoryCall(repositoryName, ['microservice', frontendOrBackend])
  mockTenantServicesCall(isPostgresService)
  mockAvailableVersions()

  if (frontendOrBackend.toLowerCase() === 'frontend') {
    mockFetchShutteringUrlsCall(repositoryName)
  }

  if (frontendOrBackend.toLowerCase() === 'backend') {
    mockApiGatewaysCall(repositoryName)
  }

  if (isPostgresService === true) {
    mockFetchAvailableMigrations(repositoryName)
    mockFetchLatestMigrations(repositoryName)
  }

  mockWhatsRunningWhereCall(repositoryName)
}

function buildAuthDetail(
  server,
  { isAdmin, isTenant, teamScope = 'some-other-team-id', additionalScopes = [] }
) {
  const user = {
    id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    displayName: 'B. A. Baracus'
  }
  const scope = [
    teamScope,
    isAdmin && scopes.admin,
    isTenant && scopes.tenant,
    ...additionalScopes
  ].filter(Boolean)
  const isAuthenticated = isAdmin || isTenant

  if (isAuthenticated) {
    return {
      userSession: {
        ...user,
        isAdmin,
        isTenant,
        isAuthenticated,
        scope,
        uuidScope: additionalScopes.filter(uuidValidate)
      },
      auth: {
        credentials: { user, scope },
        strategy: 'default'
      }
    }
  }

  return {
    userSession: null
  }
}

export async function mockAuthAndRenderUrl(server, { targetUrl, ...options }) {
  const { userSession, auth } = buildAuthDetail(server, options)

  getUserSession.mockResolvedValue?.(userSession)

  const { result, statusCode } = await server.inject({
    method: 'GET',
    url: targetUrl,
    auth
  })

  return { result, statusCode }
}

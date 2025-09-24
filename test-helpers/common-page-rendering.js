import isNil from 'lodash/isNil.js'
import capitalize from 'lodash/capitalize.js'

import { createServer } from '../src/server/index.js'
import { fetchTestRuns } from '../src/server/test-suites/helpers/fetch/fetch-test-runs.js'
import { fetchRepository } from '../src/server/common/helpers/fetch/fetch-repository.js'
import {
  fetchTenantService,
  fetchTenantServiceByEnvironment
} from '../src/server/common/helpers/fetch/fetch-tenant-service.js'
import { getUserSession } from '../src/server/common/helpers/auth/get-user-session.js'
import { scopes } from '@defra/cdp-validation-kit'
import { fetchAvailableVersions } from '../src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import {
  fetchEntities,
  fetchEntity,
  fetchEntityStatus
} from '../src/server/common/helpers/fetch/fetch-entities.js'
import { fetchApiGateways } from '../src/server/services/helpers/fetch/fetch-api-gateways.js'
import { fetchRunningServices } from '../src/server/common/helpers/fetch/fetch-running-services.js'
import { fetchAvailableMigrations } from '../src/server/services/helpers/fetch/fetch-available-migrations.js'
import { fetchLatestMigrations } from '../src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { fetchShutteringUrls } from '../src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { availableMigrationsFixture } from '../src/__fixtures__/migrations/available-migrations.js'
import { latestMigrationsFixture } from '../src/__fixtures__/migrations/latest-migrations.js'
import { apiGatewaysFixture } from '../src/__fixtures__/api-gateways.js'
import { shutteringUrlsFixture } from '../src/__fixtures__/shuttering/shuttering-urls.js'
import { tenantServicesFixture } from '../src/__fixtures__/tenant-services.js'
import {
  fetchTenantDatabase,
  fetchTenantDatabaseByEnvironment
} from '../src/server/common/helpers/fetch/fetch-tenant-databases.js'
import { tenantDatabasesFixture } from '../src/__fixtures__/tenant-databases.js'
import { config } from '../src/config/config.js'
import { fetchCdpTeams } from '../src/server/teams/helpers/fetch/fetch-cdp-teams.js'
import { cdpTeamsFixture } from '../src/__fixtures__/admin/cdp-teams.js'
import {
  cdpTeamBeesFixture,
  cdpTeamFixture
} from '../src/__fixtures__/admin/cdp-team.js'
import { fetchTeamRepositories } from '../src/server/teams/helpers/fetch/fetchers.js'
import { teamMicroserviceEntitiesFixture } from '../src/__fixtures__/teams/micro-services.js'
import { teamTestSuitesEntitiesFixture } from '../src/__fixtures__/teams/test-suites.js'
import { teamRepositoriesFixture } from '../src/__fixtures__/teams/repositories.js'
import { fetchCdpUser } from '../src/server/admin/users/helpers/fetch/fetchers.js'
import { cdpUserFixture } from '../src/__fixtures__/admin/cdp-user.js'
import { fetchCdpTeam } from '../src/server/admin/teams/helpers/fetch/fetchers.js'

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
  config.set('session.cache.engine', 'memory')

  const server = await createServer()

  await mockCsrfToken(server)

  await server.initialize()
  return server
}

export function mockRepositoryCall(repositoryName, additionalTopics) {
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

export function mockFetchCdpUserCall() {
  fetchCdpUser.mockResolvedValue?.(cdpUserFixture)
}

export function mockFetchCdpTeamsCall() {
  fetchCdpTeams.mockResolvedValue?.(cdpTeamsFixture)
}

export function mockFetchCdpTeamCall(teamId) {
  switch (true) {
    case teamId === 'platform':
      fetchCdpTeam.mockResolvedValue?.(cdpTeamFixture)
      break
    case teamId === 'bees':
      fetchCdpTeam.mockResolvedValue?.(cdpTeamBeesFixture)
      break
    default:
      throw new Error(`Unhandled teamId ${teamId} in mockFetchTeamCall`)
  }

  fetchCdpTeam.mockResolvedValue?.(
    teamId === 'platform' ? cdpTeamFixture : mockTeam
  )
}

export function mockResourcesCall() {
  fetchTenantService.mockResolvedValue?.(tenantServicesFixture)
  fetchTenantDatabase.mockResolvedValue?.(tenantDatabasesFixture)
}

export function mockCommonTeamCalls() {
  fetchEntities.mockImplementation(({ type }) => {
    if (type === 'Microservice') {
      return teamMicroserviceEntitiesFixture
    }
    if (type === 'TestSuite') {
      return teamTestSuitesEntitiesFixture
    }
  })

  fetchTeamRepositories.mockResolvedValue?.(teamRepositoriesFixture)
}

export function mockResourcesByEnvironmentCall(environment) {
  fetchTenantServiceByEnvironment.mockResolvedValue?.(
    tenantServicesFixture[environment]
  )
  fetchTenantDatabaseByEnvironment.mockResolvedValue?.(
    tenantDatabasesFixture[environment]
  )
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

function mockTestSuiteEntityCall(repositoryName, status) {
  mockEntityCall(repositoryName, 'TestSuite', 'journey', status)
}

export function mockTestSuiteEntityStatusCall(
  repositoryName,
  frontendOrBackend,
  status = 'Created'
) {
  fetchEntityStatus.mockResolvedValue?.({
    entity: getEntity(repositoryName, 'TestSuite', frontendOrBackend, status),
    resources: {
      Repository: true,
      SquidProxy: false,
      AppConfig: true,
      TenantServices: false
    }
  })
}

function getEntity(repositoryName, type, subType, status) {
  return {
    name: repositoryName,
    type,
    subType: subType ? capitalize(subType) : null,
    primaryLanguage: 'JavaScript',
    created: '2024-12-05T11:21:25Z',
    creator: null,
    teams: [mockTeam],
    status,
    decommissioned: null,
    tags: ['live']
  }
}

export function mockEntityCall(repositoryName, type, subType, status) {
  fetchEntity.mockResolvedValue?.(
    getEntity(repositoryName, type, subType, status)
  )
}

export function mockServiceEntityCall(
  repositoryName,
  frontendOrBackend,
  status = 'Created',
  type = 'Microservice'
) {
  mockEntityCall(repositoryName, type, frontendOrBackend, status)
}

export function mockServiceEntityStatusCall(
  repositoryName,
  frontendOrBackend,
  status = 'Created'
) {
  fetchEntityStatus.mockResolvedValue?.({
    entity: getEntity(
      repositoryName,
      'Microservice',
      frontendOrBackend,
      status
    ),
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

export function mockRepositoryEntityStatusCall(repositoryName, status) {
  fetchEntityStatus.mockResolvedValue?.({
    entity: getEntity(repositoryName, 'Repository', null, status),
    resources: {
      Repository: true
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

export function mockCommonTestSuiteCalls(repositoryName, status = 'Created') {
  mockRepositoryCall(repositoryName, ['test-suite', 'journey'])
  mockTestSuiteEntityCall(repositoryName, status)
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

export function mockFetchShutteringUrlsCall(repositoryName) {
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
  mockFetchShutteringUrlsCall(repositoryName)

  if (frontendOrBackend?.toLowerCase() === 'backend') {
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
    displayName: 'B. A. Baracus',
    email: 'b.a.baracus@defradev.onmicrosoft.com'
  }
  const scope = [
    `team:${teamScope}`,
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
        scope
      },
      auth: {
        credentials: { user, scope },
        strategy: 'default'
      }
    }
  }

  // Microsoft authenticated user, Not CDP registered,
  if (isNil(isAdmin) && isNil(isTenant)) {
    return {
      userSession: {
        ...user,
        isAdmin: false,
        isTenant: false,
        isAuthenticated: true,
        scope: []
      },
      auth: {
        credentials: { user: null, scope: [] },
        strategy: 'default'
      }
    }
  }

  return {
    userSession: null
  }
}

export async function mockAuthAndRenderUrl(server, options = {}) {
  const { userSession, auth } = buildAuthDetail(server, options)

  getUserSession.mockResolvedValue?.(userSession)

  const { result, statusCode } = await server.inject({
    method: 'GET',
    url: options.targetUrl,
    auth,
    headers: options.headers || {}
  })

  return { result, statusCode }
}

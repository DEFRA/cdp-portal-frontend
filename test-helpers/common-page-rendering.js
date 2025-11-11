import fs from 'node:fs'
import path from 'node:path'
import isNil from 'lodash/isNil.js'
import capitalize from 'lodash/capitalize.js'

import { createServer } from '../src/server/index.js'
import { fetchTestRuns } from '../src/server/test-suites/helpers/fetch/fetch-test-runs.js'
import { fetchRepository } from '../src/server/common/helpers/fetch/fetch-repository.js'
import { getUserSession } from '../src/server/common/helpers/auth/get-user-session.js'
import { entityTypes, scopes } from '@defra/cdp-validation-kit'
import { fetchAvailableVersions } from '../src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import {
  fetchEntities,
  fetchEntity
} from '../src/server/common/helpers/fetch/fetch-entities.js'
import { fetchRunningServices } from '../src/server/common/helpers/fetch/fetch-running-services.js'
import { fetchAvailableMigrations } from '../src/server/services/helpers/fetch/fetch-available-migrations.js'
import { fetchLatestMigrations } from '../src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { availableMigrationsFixture } from '../src/__fixtures__/migrations/available-migrations.js'
import { latestMigrationsFixture } from '../src/__fixtures__/migrations/latest-migrations.js'
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
import { fetchMarkdown } from '../src/server/documentation/helpers/s3-file-handler.js'
import { entitiesResourcesFixture } from '../src/__fixtures__/entities/entity.js'
import { fetchShutteringUrls } from '../src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { shutteringUrlsFixture } from '../src/__fixtures__/shuttering/shuttering-urls.js'

const dirname = import.meta.dirname

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

function mockTestSuiteEntityCall(repositoryName, status) {
  mockEntityCall(repositoryName, 'TestSuite', 'journey', status)
}

function getEntity(repositoryName, type, subType, status) {
  function buildProgress(type, status) {
    const steps = {}
    if (type === entityTypes.microservice || type === entityTypes.testSuite) {
      steps.logs = status === 'Created'
      steps.nginx = status === 'Created'
      steps.infra = status === 'Created'
      steps.squid = status === 'Created'
      steps.metrics = status === 'Created'
    }
    return {
      complete: status === 'Created',
      steps
    }
  }

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
    tags: ['live'],
    environments: entitiesResourcesFixture.environments,
    progress: {
      'infra-dev': buildProgress(status),
      management: buildProgress(status)
    },
    overallProgress: buildProgress(status)
  }
}

export function mockEntityCall(repositoryName, type, subType, status) {
  fetchEntity.mockResolvedValue?.(
    getEntity(repositoryName, type, subType, status)
  )
}

export function mockServiceEntityCall(
  repositoryName,
  subType,
  status = 'Created',
  type = 'Microservice'
) {
  mockEntityCall(repositoryName, type, subType, status)
}

export function mockServiceEntityCallWithPostgres(
  repositoryName,
  subType,
  status = 'Created',
  type = 'Microservice'
) {
  const entity = getEntity(repositoryName, type, subType, status)
  Object.keys(entity.environments).forEach((env) => {
    entity.environments[env].sql_database = {
      arn: 'arn:aws:rds:eu-west-2:5466456456:cluster:example-mock-service-frontend',
      endpoint:
        'example-mock-service-frontend.cluster-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
      reader_endpoint:
        'example-mock-service-frontend.cluster-ro-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
      name: 'example-mock-service-frontend',
      port: 5422,
      engine_version: '16.8',
      engine: 'magical-postgresql',
      database_name: 'awesome-cakes'
    }
  })
  fetchEntity.mockResolvedValue?.(entity)
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
        configVersion: null,
        profile: 'smoke'
      },
      {
        runId: '3ec0b267-e513-4dd1-a525-8a3a798a9c4c',
        testSuite: repositoryName,
        environment: 'infra-dev',
        cpu: 0,
        memory: 0,
        user: {
          id: '90552794-0613-4023-819a-512aa9d40023',
          displayName: 'Test, User'
        },
        deployment: null,
        created: '2024-11-02T12:59:56.102Z',
        taskArn:
          'arn:aws:ecs:eu-west-2:12334656:task/infra-dev-ecs-public/19abc1234564a009128875ffa6b9047',
        taskStatus: 'finished',
        taskLastUpdated: '2024-11-01T14:29:53.102Z',
        testStatus: 'passed',
        tag: '0.11.0',
        failureReasons: [],
        configVersion: null,
        profile: null
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

export async function mockBlogPreviewArticles() {
  fetchMarkdown.mockResolvedValueOnce?.(
    fs.readFileSync(
      path.resolve(dirname, '..', 'src', '__fixtures__', 'blog', 'blog-nav.md'),
      'utf8'
    )
  )
  fetchMarkdown.mockResolvedValueOnce?.(
    fs.readFileSync(
      path.resolve(
        dirname,
        '..',
        'src',
        '__fixtures__',
        'blog',
        '20251017-introducing-the-cdp-blog.md'
      ),
      'utf8'
    )
  )
  fetchMarkdown.mockResolvedValueOnce?.(
    fs.readFileSync(
      path.resolve(
        dirname,
        '..',
        'src',
        '__fixtures__',
        'blog',
        '20251024-passing-profile-to-the-test-suite.md'
      ),
      'utf8'
    )
  )
}

export async function mockBlogArticle(articleFileName) {
  fetchMarkdown.mockResolvedValueOnce?.(
    fs.readFileSync(
      path.resolve(
        dirname,
        '..',
        'src',
        '__fixtures__',
        'blog',
        articleFileName
      ),
      'utf8'
    )
  )

  fetchMarkdown.mockResolvedValueOnce?.(
    fs.readFileSync(
      path.resolve(dirname, '..', 'src', '__fixtures__', 'blog', 'blog-nav.md'),
      'utf8'
    )
  )
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
  mockAvailableVersions()
  mockFetchShutteringUrlsCall(repositoryName)

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

import { createServer } from '~/src/server/index.js'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/fetch-test-runs.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import { fetchTestSuite } from '~/src/server/test-suites/helpers/fetch/fetch-test-suite.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { config } from '~/src/config/config.js'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'

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
  const server = await createServer()

  await mockCsrfToken(server)

  await server.initialize()
  return server
}

function mockSharedServicesCalls(jest, repositoryName, additionalTopics) {
  jest.mocked(fetchDeployableService).mockResolvedValue({
    serviceName: repositoryName,
    imageName: repositoryName,
    description: 'Mock service description'
  })

  jest.mocked(fetchRepository).mockResolvedValue({
    repository: {
      repositoryName,
      createdAt: '2016-12-05T11:21:25+00:00',
      topics: ['cdp', ...additionalTopics],
      primaryLanguage: 'JavaScript',
      teams: [
        {
          teamId: 'mock-team-id',
          name: 'Mock Team'
        }
      ]
    }
  })

  jest.mocked(fetchTenantService).mockResolvedValue({ repositoryName })
}

function mockTestSuiteCall(jest, repositoryName) {
  jest.mocked(fetchTestSuite).mockResolvedValue({
    serviceName: repositoryName,
    githubUrl: `github.com/DEFRA/${repositoryName}`
  })
}

function mockTestRuns(jest, repositoryName) {
  jest.mocked(fetchTestRuns).mockResolvedValue({
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

function mockOidcCall(jest) {
  jest.mocked(fetchJson).mockImplementationOnce((url) => {
    // Setting up oidc fetcher call
    if (url === config.get('oidcWellKnownConfigurationUrl')) {
      return Promise.resolve({
        res: {
          statusCode: 200
        },
        payload: {
          token_endpoint: 'https://mock-login/oauth2/v2.0/token',
          authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
        }
      })
    }

    return Promise.resolve({})
  })
}

export function mockCommonTestSuiteCalls(jest, repositoryName) {
  mockOidcCall(jest)
  mockTestRuns(jest, repositoryName)
  mockSharedServicesCalls(jest, repositoryName, ['test-suite', 'journey'])
  mockTestSuiteCall(jest, repositoryName)
}

function mockAvailableVersions(jest) {
  jest.mocked(fetchAvailableVersions).mockResolvedValue([
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

export function mockCommonServicesCalls(
  jest,
  repositoryName,
  frontendOrBackend
) {
  mockOidcCall(jest)
  mockSharedServicesCalls(jest, repositoryName, [
    'microservice',
    frontendOrBackend
  ])
  mockAvailableVersions(jest)
}

export function mockAuthResponse({
  jest,
  isAdmin,
  isTenant,
  isAuthenticated,
  teamScope = 'some-other-team-id',
  additionalScopes = []
}) {
  jest.mocked(getUserSession).mockReturnValue({
    user: { id: 12345, displayName: 'Mr Test User' },
    isAdmin,
    isTenant,
    isAuthenticated,
    scope: [
      teamScope,
      isAdmin ? scopes.admin : '',
      isTenant ? scopes.tenant : '',
      ...additionalScopes
    ]
  })
}

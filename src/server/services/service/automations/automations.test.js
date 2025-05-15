import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonServicesCalls,
  mockTeam
} from '~/test-helpers/common-page-rendering.js'
import {
  fetchTeamTestRepositories,
  getAutoDeployDetails,
  getAutoTestRunDetails
} from '~/src/server/services/service/automations/helpers/fetchers.js'
import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-entities.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/service/automations/helpers/fetchers.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')

const serviceName = 'mock-service-with-automations'

describe('Service Automations page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    mockCommonServicesCalls(serviceName)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('deployments view', () => {
    beforeAll(() => {
      getAutoDeployDetails.mockResolvedValue({
        serviceName,
        environments: ['dev', 'prod']
      })
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/deployments`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/deployments`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/deployments`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/deployments`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })

  describe('test-runs view', () => {
    beforeAll(() => {
      fetchTeamTestRepositories.mockResolvedValue({
        repositories: [
          {
            repositoryName: 'some-test-repo',
            description: 'Mock service description',
            createdAt: '2016-12-05T11:21:25+00:00',
            url: `https://github.com/DEFRA/some-test-repo`,
            topics: ['cdp', 'test', 'Journey'],
            primaryLanguage: 'JavaScript',
            teams: [mockTeam]
          },
          {
            repositoryName: 'some-other-test-repo',
            description: 'Mock service description',
            createdAt: '2016-12-05T11:21:25+00:00',
            url: `https://github.com/DEFRA/some-other-test-repo`,
            topics: ['cdp', 'test', 'journey'],
            primaryLanguage: 'JavaScript',
            teams: [mockTeam]
          },
          {
            repositoryName: 'some-perf-test-repo',
            description: 'Mock service description',
            createdAt: '2016-12-05T11:21:25+00:00',
            url: `https://github.com/DEFRA/some-perf-test-repo`,
            topics: ['cdp', 'test', 'performance'],
            primaryLanguage: 'JavaScript',
            teams: [mockTeam]
          }
        ]
      })
      getAutoTestRunDetails.mockResolvedValue({
        serviceName,
        testSuites: {
          'some-test-repo': ['dev', 'test']
        }
      })
      fetchTestSuites.mockResolvedValue([
        {
          name: 'some-test-repo',
          type: 'TestSuite',
          subType: 'Journey',
          primaryLanguage: 'JavaScript',
          created: '2016-12-05T11:21:25Z',
          creator: null,
          teams: [mockTeam],
          status: 'Success',
          decommissioned: null
        },
        {
          name: 'some-other-test-repo',
          type: 'TestSuite',
          subType: 'Journey',
          primaryLanguage: 'JavaScript',
          created: '2016-12-05T11:21:25Z',
          creator: null,
          teams: [mockTeam],
          status: 'Success',
          decommissioned: null
        },
        {
          name: 'some-perf-test-repo',
          type: 'TestSuite',
          subType: 'Performance',
          primaryLanguage: 'JavaScript',
          created: '2016-12-05T11:21:25Z',
          creator: null,
          teams: [mockTeam],
          status: 'Success',
          decommissioned: null
        }
      ])
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/test-runs`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/test-runs`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/test-runs`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/automations/test-runs`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })
})

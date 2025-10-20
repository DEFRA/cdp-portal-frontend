import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockFetchShutteringUrlsCall,
  mockServiceEntityCall,
  mockTeam
} from '../../../../../test-helpers/common-page-rendering.js'
import {
  getAutoDeployDetails,
  getAutoTestRunDetails
} from './helpers/fetchers.js'
import { fetchTestSuites } from '../../../common/helpers/fetch/fetch-entities.js'
import { entitySubTypes, statusCodes } from '@defra/cdp-validation-kit'

vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('./helpers/fetchers.js')
vi.mock('../../helpers/fetch/fetch-shuttering-urls.js')

describe('Service Automations page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Frontend service', () => {
    const serviceName = 'mock-service-with-automations'
    beforeAll(async () => {
      mockServiceEntityCall(serviceName, entitySubTypes.frontend)
      server = await initialiseServer()
      mockFetchShutteringUrlsCall()
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
        expect(statusCode).toBe(statusCodes.ok)
        expect(result).toMatchFile()
      })

      test('page errors for logged in tenant who doesnt own service', async () => {
        const { statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/deployments`,
          isAdmin: false,
          isTenant: true
        })
        expect(statusCode).toBe(statusCodes.forbidden)
      })

      test('page renders for logged in service owner tenant', async () => {
        const { result, statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/deployments`,
          isAdmin: false,
          isTenant: true,
          teamScope: 'mock-team-id'
        })
        expect(statusCode).toBe(statusCodes.ok)
        expect(result).toMatchFile()
      })

      test('page errors with 401 for logged out user', async () => {
        const { statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/deployments`,
          isAdmin: false,
          isTenant: false
        })
        expect(statusCode).toBe(statusCodes.unauthorized)
      })
    })

    describe('test-runs view', () => {
      beforeAll(() => {
        getAutoTestRunDetails.mockResolvedValue({
          serviceName,
          testSuites: {
            'some-test-repo': [
              {
                profile: undefined,
                environments: ['dev', 'test']
              },
              {
                profile: 'smoke',
                environments: ['management', 'ext-test', 'prod']
              }
            ],
            'some-other-test-repo': [
              {
                profile: undefined,
                environments: ['infra-dev', 'test']
              },
              {
                profile: 'other-profile',
                environments: ['ext-test', 'dev']
              }
            ]
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
        expect(statusCode).toBe(statusCodes.ok)
        expect(result).toMatchFile()
      })

      test('page errors for logged in tenant who doesnt own service', async () => {
        const { statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/test-runs`,
          isAdmin: false,
          isTenant: true
        })
        expect(statusCode).toBe(statusCodes.forbidden)
      })

      test('page renders for logged in service owner tenant', async () => {
        const { result, statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/test-runs`,
          isAdmin: false,
          isTenant: true,
          teamScope: 'mock-team-id'
        })
        expect(statusCode).toBe(statusCodes.ok)
        expect(result).toMatchFile()
      })

      test('page errors with 401 for logged out user', async () => {
        const { statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/test-runs`,
          isAdmin: false,
          isTenant: false
        })
        expect(statusCode).toBe(statusCodes.unauthorized)
      })
    })
  })

  describe('Prototype', () => {
    const serviceName = 'mock-prototype-service'

    beforeAll(async () => {
      mockServiceEntityCall(serviceName, entitySubTypes.prototype)
      server = await initialiseServer()
      mockFetchShutteringUrlsCall()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
    })

    describe('deployments view', () => {
      beforeAll(() => {
        getAutoDeployDetails.mockResolvedValue({
          serviceName,
          environments: ['infra-dev', 'dev']
        })
      })

      test('page renders for logged in admin user without test-runs options', async () => {
        const { result, statusCode } = await mockAuthAndRenderUrl(server, {
          targetUrl: `/services/${serviceName}/automations/deployments`,
          isAdmin: true,
          isTenant: true
        })
        expect(statusCode).toBe(statusCodes.ok)
        expect(result).toMatchFile()
      })
    })
  })
})

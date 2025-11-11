import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls
} from '../../../../../test-helpers/common-page-rendering.js'
import { fetchAllSecrets } from '../../../services/helpers/fetch/fetch-all-secrets.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { fetchSecrets } from '../../../common/helpers/fetch/fetch-secrets.js'

vi.mock('../../helpers/fetch/fetch-test-runs.js')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/fetch/fetch-repository.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('../../../services/helpers/fetch/fetch-all-secrets.js')
vi.mock('../../../common/helpers/fetch/fetch-secrets.js')

describe('Secrets Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    fetchAllSecrets.mockResolvedValue({
      'infra-dev': {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      },
      management: {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      }
    })
    fetchSecrets.mockResolvedValue({
      keys: ['SOME_KEY'],
      lastChangedDate: '2024-11-15T16:03:38.3139986Z',
      createdDate: null
    })

    mockCommonTestSuiteCalls('mock-test-suite')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets/infra-dev',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets/dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets/prod',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets/management',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/secrets/management',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})

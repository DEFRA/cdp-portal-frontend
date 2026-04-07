import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { getEntityDependencies } from '../../../DependencyService.js'
import { getDependencyTypes } from '../../../FilterService.js'

vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('../../../DependencyService.js')
vi.mock('../../../FilterService.js')

getEntityDependencies.mockResolvedValue({
  results: [],
  meta: { total: 0, totalPages: 1 }
})
getDependencyTypes.mockResolvedValue([])

describe('Dependency explorer, service dependencies page', () => {
  let server

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer/services/test-service/1.0.0',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer/services/test-service/1.0.0',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page DOES NOT renders for logged in service owner tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer/services/test-service/1.0.0',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page DOES NOT render for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer/services/test-service/1.0.0',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})

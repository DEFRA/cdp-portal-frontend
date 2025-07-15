import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '~/test-helpers/common-page-rendering.js'
import { fetchFeatureToggles } from '~/src/server/admin/features/helpers/fetch-feature-toggles.js'
import { featuresFixture } from '~/src/__fixtures__/features.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/admin/features/helpers/fetch-feature-toggles.js')

describe('Feature Toggles page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    fetchFeatureToggles.mockResolvedValue(featuresFixture)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('list view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/features',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/features',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/features',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})

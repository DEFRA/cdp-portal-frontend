import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')

describe('Request resources page', () => {
  let server

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/create/resources/detail`,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/create/resources/detail`,
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/create/resources/detail`,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})

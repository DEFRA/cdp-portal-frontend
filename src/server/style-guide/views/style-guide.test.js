import { statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'

vi.mock('../../../common/helpers/auth/get-user-session.js')

describe('Style Guide page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('renders for admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide',
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('Style Guide')
    expect(result).toContain(
      'Components, patterns, tools and style guide documentation'
    )
  })

  test('returns 200 for non-admin tenant user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide',
      isAdmin: false,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
  })

  test('returns 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide',
      isAdmin: false,
      isTenant: false
    })

    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})

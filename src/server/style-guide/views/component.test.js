import { statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'

vi.mock('../../../common/helpers/auth/get-user-session.js')

describe('Style Guide component page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('renders button component page for admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide/button',
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('Button')
    expect(result).toContain('Parameters')
    expect(result).toContain('Examples')
  })

  test('renders tag component page for admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide/tag',
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('Tag')
    expect(result).toContain(
      'Enhanced GOV.UK tag with optional loader and link functionality'
    )
  })

  test('returns 404 for non-existent component', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide/non-existent-component',
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('returns 200 for non-admin user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/style-guide/button',
      isAdmin: false,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
  })
})

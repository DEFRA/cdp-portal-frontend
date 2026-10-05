import { createHmac } from 'node:crypto'

import { entitySubTypes, scopes, statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres,
  mockTeam
} from '#test-helpers/common-page-rendering.js'
import { fetchEntity } from '#server/common/helpers/fetch/fetch-entities.js'
import { config } from '#config/config.js'
import { shellAuthCookieName } from './helpers/set-shell-auth-cookie.js'

vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('../../helpers/fetch/fetch-shuttering-urls.js')

const serviceName = 'mock-service-with-terminal'
const terminalUrl = `/services/${serviceName}/terminal`

const findCookie = (headers, name) =>
  [headers['set-cookie']]
    .flat()
    .find((cookie) => cookie?.startsWith(`${name}=`))
const cookieValue = (cookie) => cookie.split(';')[0].split('=')[1]

describe('Service Terminal page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const previousShellAuthCookieConfig = config.get('shellAuthCookie')

  beforeAll(async () => {
    // The cookie definition is registered when the server starts, so set these first
    config.set('shellAuthCookie', {
      ...previousShellAuthCookieConfig,
      isSecure: true,
      domain: '.cdp-int.defra.cloud'
    })
    mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
    server = await initialiseServer()
  })

  afterAll(async () => {
    config.set('shellAuthCookie', previousShellAuthCookieConfig)
    await server.stop({ timeout: 0 })
  })

  test('redirects to the first environment the user can launch in', async () => {
    const { headers, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.redirect)
    expect(headers.location).toBe(`${terminalUrl}/dev`)
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders prod for admin user with break glass', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: true,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('prod renders for service owner tenant with break glass', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('app-button--significant')
  })

  test('prod is not found for service owner tenant without break glass', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('unknown environment is not found', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/not-an-env`,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('page errors for logged in non-service owner tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page errors with 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })

  test('page renders empty state when service is in no environments', async () => {
    const entity = await fetchEntity()
    fetchEntity.mockResolvedValue({ ...entity, environments: {} })
    onTestFinished(() => fetchEntity.mockResolvedValue(entity))

    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('does not exist in any environment')
  })

  describe('shell auth cookie', () => {
    const secret = 'test-shell-auth-secret'
    const token = 'a'.repeat(64)

    function overrideShellAuthCookieConfig(overrides) {
      const previous = config.get('shellAuthCookie')
      config.set('shellAuthCookie', { ...previous, ...overrides })
      onTestFinished(() => config.set('shellAuthCookie', previous))
    }

    test('is signed and scoped to the shell token', async () => {
      overrideShellAuthCookieConfig({ secret })

      const { headers, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `${terminalUrl}/dev/${token}`,
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      const shellAuthCookie = findCookie(headers, shellAuthCookieName)
      expect(shellAuthCookie).toContain(`Path=/${token}`)
      expect(shellAuthCookie).toContain('Domain=.cdp-int.defra.cloud')
      expect(shellAuthCookie).toContain('HttpOnly')
      expect(shellAuthCookie).toContain('Secure')
      expect(shellAuthCookie).toContain('SameSite=Lax')
      expect(shellAuthCookie).toContain(`Max-Age=${8 * 60 * 60}`)

      const [payload, signature] = cookieValue(shellAuthCookie).split('.')
      expect(signature).toBe(
        createHmac('sha256', secret).update(payload).digest('base64url')
      )
      expect(
        JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
      ).toEqual({ oid: expect.any(String), token, exp: expect.any(Number) })
    })

    test('uses the configured ttl', async () => {
      overrideShellAuthCookieConfig({ ttlSeconds: 2 * 60 * 60 })

      const { headers, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `${terminalUrl}/dev/${token}`,
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(findCookie(headers, shellAuthCookieName)).toContain(
        `Max-Age=${2 * 60 * 60}`
      )
    })

    test('rejects a token that is not a 64 char hex string', async () => {
      const { headers, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `${terminalUrl}/dev/abc%3Bdef`,
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.forbidden)
      expect(findCookie(headers, shellAuthCookieName)).toBeUndefined()
    })
  })
})

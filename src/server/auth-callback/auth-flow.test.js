import { initialiseServer } from '#test-helpers/common-page-rendering.js'
import { fetchScopes } from '#server/teams/helpers/fetch/fetch-scopes.js'
import { authCompletePath } from './auth-complete-controller.js'

const signedInUser = {
  accessToken: 'an-access-token',
  refreshToken: 'a-refresh-token',
  expiresIn: 3600,
  claims: { oid: 'user-id', name: 'A User', email: 'a.user@defra.gov.uk' }
}

const { oidcCredentials } = vi.hoisted(() => ({ oidcCredentials: {} }))

vi.mock('@defra/hapi-auth-oidc', () => ({
  CognitoTokenProvider: class {},
  MockProvider: class {},
  hapiAuthOidcPlugin: {
    name: 'hapi-auth-oidc',
    register: (server) => {
      server.decorate('request', 'login', (h) =>
        h.redirect('https://identity.example.com/authorize')
      )
      server.decorate('request', 'callback', () => oidcCredentials.value)
      server.decorate('request', 'ensureValidToken', (session) => ({
        token: session.token,
        refreshed: false
      }))
    }
  }
}))

vi.mock('#server/teams/helpers/fetch/fetch-scopes.js')

const cookie = (response, name) =>
  response.headers['set-cookie']
    ?.find((header) => header.startsWith(`${name}=`))
    ?.split(';')
    .at(0)

describe('#authFlow', () => {
  let server

  const signIn = (referer, sessionCookie) =>
    server.inject({
      method: 'GET',
      url: '/login',
      headers: {
        ...(referer ? { referer } : {}),
        ...(sessionCookie ? { cookie: sessionCookie } : {})
      }
    })

  // response_mode=form_post makes this a cross-site POST, so the browser
  // withholds every SameSite=Lax cookie. Sending none is what that looks like.
  const returnFromProvider = () =>
    server.inject({
      method: 'POST',
      url: '/auth/callback',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      payload: 'code=an-auth-code&state=some-state'
    })

  const finishSignIn = (cookies) =>
    server.inject({
      method: 'GET',
      url: authCompletePath,
      headers: { cookie: cookies.join('; ') }
    })

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    oidcCredentials.value = signedInUser
    fetchScopes.mockResolvedValue({
      scopes: [],
      scopeFlags: { isAdmin: false }
    })
  })

  test('should return the user to the page they signed in from', async () => {
    const signInResponse = await signIn(
      'http://localhost:3000/services/cdp-portal-frontend?tab=all'
    )
    const sessionCookie = cookie(signInResponse, 'session')

    const providerResponse = await returnFromProvider()
    const userSessionCookie = cookie(providerResponse, 'userSessionCookie')

    expect(providerResponse.statusCode).toBe(200)
    expect(providerResponse.result).toContain(authCompletePath)

    const finishResponse = await finishSignIn([
      sessionCookie,
      userSessionCookie
    ])

    expect(finishResponse.statusCode).toBe(302)
    expect(finishResponse.headers.location).toBe(
      '/services/cdp-portal-frontend?tab=all'
    )
  })

  test('should return the user to a referer sent as a relative path', async () => {
    const signInResponse = await signIn('/services/cdp-portal-frontend')
    const sessionCookie = cookie(signInResponse, 'session')

    const providerResponse = await returnFromProvider()
    const userSessionCookie = cookie(providerResponse, 'userSessionCookie')

    const finishResponse = await finishSignIn([
      sessionCookie,
      userSessionCookie
    ])

    expect(finishResponse.headers.location).toBe(
      '/services/cdp-portal-frontend'
    )
  })

  test('should not reissue the session cookie on the callback, which would orphan the return path', async () => {
    await signIn('http://localhost:3000/services/cdp-portal-frontend')

    const providerResponse = await returnFromProvider()

    expect(cookie(providerResponse, 'session')).toBeUndefined()
  })

  test('should sign the user in', async () => {
    await signIn('http://localhost:3000/services')

    const providerResponse = await returnFromProvider()

    expect(cookie(providerResponse, 'userSessionCookie')).toBeDefined()
  })

  test.for([
    ['there is no referer', undefined],
    ['the referer is the auth callback', 'http://localhost:3000/auth/callback'],
    [
      'the referer path is protocol relative',
      'http://localhost:3000//malicious.example.com/'
    ],
    [
      'the referer path is protocol relative via backslashes',
      String.raw`http://localhost:3000/\malicious.example.com/`
    ],
    [
      'the referer is a relative path made protocol relative by backslashes',
      String.raw`/\malicious.example.com/`
    ],
    ['the referer is not a usable url', 'malicious.example.com']
  ])('should return the user home when %s', async ([, referer]) => {
    const signInResponse = await signIn(referer)
    const sessionCookie = cookie(signInResponse, 'session')

    const providerResponse = await returnFromProvider()
    const userSessionCookie = cookie(providerResponse, 'userSessionCookie')

    const finishResponse = await finishSignIn([
      sessionCookie,
      userSessionCookie
    ])

    expect(finishResponse.headers.location).toBe('/')
  })

  test('should return the user to the page they last signed in from when an earlier sign in was abandoned', async () => {
    const abandonedResponse = await signIn('/abandoned-sign-in')

    const signInResponse = await signIn(
      '/services/cdp-portal-frontend',
      cookie(abandonedResponse, 'session')
    )
    const sessionCookie =
      cookie(signInResponse, 'session') ?? cookie(abandonedResponse, 'session')

    const providerResponse = await returnFromProvider()
    const userSessionCookie = cookie(providerResponse, 'userSessionCookie')

    const finishResponse = await finishSignIn([
      sessionCookie,
      userSessionCookie
    ])

    expect(finishResponse.headers.location).toBe(
      '/services/cdp-portal-frontend'
    )
  })

  test('should return the user home when they reach the completion page directly', async () => {
    const finishResponse = await server.inject({
      method: 'GET',
      url: authCompletePath
    })

    expect(finishResponse.statusCode).toBe(302)
    expect(finishResponse.headers.location).toBe('/')
  })

  test('should reject the callback when the provider returns no credentials', async () => {
    oidcCredentials.value = null

    const providerResponse = await returnFromProvider()

    expect(providerResponse.statusCode).toBe(401)
    expect(cookie(providerResponse, 'userSessionCookie')).toBeUndefined()
  })

  test('should send an admin returning to services to the all services tab', async () => {
    fetchScopes.mockResolvedValue({ scopes: [], scopeFlags: { isAdmin: true } })

    const signInResponse = await signIn('http://localhost:3000/services')
    const sessionCookie = cookie(signInResponse, 'session')

    const providerResponse = await returnFromProvider()
    const userSessionCookie = cookie(providerResponse, 'userSessionCookie')

    const finishResponse = await finishSignIn([
      sessionCookie,
      userSessionCookie
    ])

    expect(finishResponse.headers.location).toBe('/services/all')
  })
})

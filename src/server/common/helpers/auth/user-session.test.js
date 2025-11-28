import jwt from '@hapi/jwt'

import { authedFetchJson } from '../fetch/authed-fetch-json.js'
import { scopesFixture } from '../../../../__fixtures__/scopes.js'
import {
  createUserSession,
  refreshUserSession,
  removeAuthenticatedUser
} from './user-session.js'

vi.mock('@hapi/jwt')
vi.mock('../fetch/authed-fetch-json.js')

describe('#userSession', () => {
  beforeAll(() => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-02-28'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('#createUserSession', () => {
    const request = {
      auth: {
        credentials: {
          expiresIn: 3600,
          profile: {
            id: 'user-id',
            email: 'user@example.com',
            displayName: 'User Name',
            loginHint: 'user@example.com',
            scopes: ['scope1', 'scope2'],
            scopeFlags: { isAdmin: true, isTenant: false }
          },
          token: 'access-token',
          refreshToken: 'refresh-token'
        },
        isAuthenticated: true
      },
      server: {
        session: {
          set: vi.fn()
        }
      }
    }
    const sessionId = 'session-id'

    test('Should create a user session with correct details', async () => {
      authedFetchJson.mockResolvedValue({ payload: scopesFixture })

      await createUserSession(request, sessionId)

      expect(request.server.session.set).toHaveBeenCalledWith(sessionId, {
        id: 'user-id',
        email: 'user@example.com',
        displayName: 'User Name',
        loginHint: 'user@example.com',
        isAuthenticated: true,
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600000,
        expiresAt: expect.any(Date)
      })
    })
  })

  describe('#refreshUserSession', () => {
    const request = {
      logger: {
        debug: vi.fn(),
        info: vi.fn()
      },
      state: { userSessionCookie: { sessionId: 'session-id' } },
      server: { session: { set: vi.fn() } },
      getUserSession: vi.fn()
    }
    const refreshTokenResponse = {
      access_token: 'new-access-token',
      expires_in: 3600,
      refresh_token: 'new-refresh-token'
    }

    beforeEach(async () => {
      jwt.token.decode.mockReturnValue({
        decoded: {
          payload: {
            oid: 'user-id',
            preferred_username: 'user@example.com',
            name: 'User Name',
            login_hint: 'user@example.com'
          }
        }
      })

      authedFetchJson.mockResolvedValue({ payload: scopesFixture })

      await refreshUserSession(request, refreshTokenResponse)
    })

    test('Should refresh the user session with new token and expiry details', () => {
      expect(request.server.session.set).toHaveBeenCalledWith('session-id', {
        id: 'user-id',
        email: 'user@example.com',
        displayName: 'User Name',
        loginHint: 'user@example.com',
        isAuthenticated: true,
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600000,
        expiresAt: expect.any(Date)
      })
    })
  })

  describe('#removeAuthenticatedUser', () => {
    test('Should remove the authenticated user from the portal', () => {
      const request = {
        dropUserSession: vi.fn(),
        sessionCookie: {
          clear: vi.fn(),
          h: {
            response: vi.fn().mockReturnThis(),
            unstate: vi.fn().mockReturnThis()
          }
        }
      }

      removeAuthenticatedUser(request)

      expect(request.dropUserSession).toHaveBeenCalled()
      expect(request.sessionCookie.clear).toHaveBeenCalled()
    })
  })
})

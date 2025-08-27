import jwt from '@hapi/jwt'

import { authedFetchJson } from '../fetch/authed-fetch-json.js'
import { scopesFixture } from '../../../../__fixtures__/scopes.js'
import {
  createUserSession,
  refreshUserSession,
  removeAuthenticatedUser,
  updateUserScope
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
        isAdmin: true,
        isTenant: false,
        scope: [
          'team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:admin',
          'permission:tenant',
          'permission:canGrantProdAccess:team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:serviceOwner:team:aabe63e7-87ef-4beb-a596-c810631fc474'
        ],
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
        isAdmin: true,
        isTenant: false,
        scope: [
          'team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:admin',
          'permission:tenant',
          'permission:canGrantProdAccess:team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:serviceOwner:team:aabe63e7-87ef-4beb-a596-c810631fc474'
        ],
        expiresIn: 3600000,
        expiresAt: expect.any(Date)
      })
    })

    test('Should log the user session refresh', () => {
      expect(request.logger.info).toHaveBeenCalledWith(
        'User session refreshed, UserId: user-id, displayName: User Name, isAdmin: true, isTenant: false, scopes: team:aabe63e7-87ef-4beb-a596-c810631fc474 permission:admin permission:tenant permission:canGrantProdAccess:team:aabe63e7-87ef-4beb-a596-c810631fc474 permission:serviceOwner:team:aabe63e7-87ef-4beb-a596-c810631fc474'
      )
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

  describe('#updateUserScope', () => {
    const request = {
      state: {
        userSessionCookie: {
          sessionId: 'session-id'
        }
      },
      server: { session: { set: vi.fn() } },
      getUserSession: vi.fn(),
      logger: { debug: vi.fn() }
    }
    const userSession = {
      token: 'access-token'
    }

    beforeEach(async () => {
      authedFetchJson.mockResolvedValue({ payload: scopesFixture })

      await updateUserScope(request, userSession)
    })

    test('Should update the user scope with new scopes and flags', () => {
      expect(request.server.session.set).toHaveBeenCalledWith('session-id', {
        ...userSession,
        isAdmin: true,
        isTenant: false,
        scope: [
          'team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:admin',
          'permission:tenant',
          'permission:canGrantProdAccess:team:aabe63e7-87ef-4beb-a596-c810631fc474',
          'permission:serviceOwner:team:aabe63e7-87ef-4beb-a596-c810631fc474'
        ]
      })

      expect(request.getUserSession).toHaveBeenCalled()
    })

    test('Should log the user session update', () => {
      expect(request.logger.debug).toHaveBeenCalledWith('User session updated')
    })
  })
})

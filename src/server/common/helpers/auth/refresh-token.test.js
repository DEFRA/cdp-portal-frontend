import { refreshTokenIfExpired } from '~/src/server/common/helpers/auth/refresh-token.js'
import pino from 'pino'
import { add, sub } from 'date-fns'
import {
  refreshUserSession,
  removeAuthenticatedUser
} from '~/src/server/common/helpers/auth/user-session.js'

jest.mock('~/src/server/common/helpers/auth/user-session.js')

describe('#refresh-token', () => {
  it('Should continue when there is no user session', async () => {
    const request = {
      logger: pino({ level: 'silent' }),
      getUserSession: jest.fn().mockResolvedValue(null)
    }

    const h = {
      continue: {}
    }

    const result = await refreshTokenIfExpired(() => undefined, request, h)
    expect(result).toEqual({})
  })

  it('Should continue when the token hasnt expired', async () => {
    const request = {
      logger: pino({ level: 'silent' }),
      getUserSession: jest.fn().mockReturnValue({
        expiresAt: add(Date.now(), { hours: 1 }).toISOString()
      })
    }

    const h = {
      continue: {}
    }

    const result = await refreshTokenIfExpired(() => undefined, request, h)
    expect(result).toEqual({})
  })

  it('Should refresh the token if expired', async () => {
    const request = {
      logger: pino({ level: 'silent' }),
      getUserSession: jest.fn().mockResolvedValue({
        expiresAt: sub(Date.now(), { hours: 1 }).toISOString()
      })
    }

    const token = {
      access_token: 'mock token',
      refresh_token: 'mock refresh token',
      expires_in: 1000
    }
    const refreshTokenFn = jest.fn().mockResolvedValue(token)

    const h = {
      continue: {}
    }

    const result = await refreshTokenIfExpired(refreshTokenFn, request, h)
    expect(result).toEqual({})
    expect(refreshUserSession).toHaveBeenCalledWith(expect.any(Object), token)
  })

  it('Should remove the session and flash an error if the refresh fails', async () => {
    const flash = jest.fn()
    const request = {
      logger: pino({ level: 'silent' }),
      yar: { flash },
      getUserSession: jest.fn().mockResolvedValue({
        expiresAt: sub(Date.now(), { hours: 1 }).toISOString()
      })
    }

    const refreshTokenFn = jest
      .fn()
      .mockRejectedValue(new Error('Token expired'))

    const h = {
      continue: {}
    }

    const result = await refreshTokenIfExpired(refreshTokenFn, request, h)
    expect(result).toEqual({})
    expect(refreshUserSession).not.toHaveBeenCalled()
    expect(removeAuthenticatedUser).toHaveBeenCalled()
    expect(flash).toHaveBeenCalled()
  })
})

import { describe, expect, test } from 'vitest'
import jwt from '@hapi/jwt'
import { tokenHasExpired } from './cognito.js'

describe('tokenHasExpired', () => {
  test('Should return true if the token has expired', () => {
    const token = jwt.token.generate({ test: 'ok' }, 'test', { ttlSec: -1 })
    expect(tokenHasExpired(token)).toBe(true)
  })

  test('Should return false if the token is still valid', () => {
    const token = jwt.token.generate({ test: 'ok' }, 'test', { ttlSec: 10000 })
    expect(tokenHasExpired(token)).toBe(false)
  })
})

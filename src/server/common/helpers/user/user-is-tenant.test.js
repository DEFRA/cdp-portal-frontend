import { describe, expect, test } from 'vitest'
import { userIsTenant } from './user-is-tenant.js'

describe('#userIsTenant', () => {
  test('Should have scope', () => {
    const checkUserIsTenant = userIsTenant({
      scope: [],
      isTenant: true
    })
    expect(checkUserIsTenant).toBe(true)
  })

  test('Should not have scope', () => {
    const checkUserIsTenant = userIsTenant({
      scope: [],
      isTenant: false
    })
    expect(checkUserIsTenant).toBe(false)
  })
})

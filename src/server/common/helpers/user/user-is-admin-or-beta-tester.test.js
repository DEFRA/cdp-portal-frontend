import { scopes } from '@defra/cdp-validation-kit'
import { userIsAdminOrBetaTester } from './user-is-admin-or-beta-tester.js'
import { betaTesterScope } from '#server/common/constants/scopes.js'

describe('#userIsAdminOrBetaTester', () => {
  test('Should be true for an admin', () => {
    expect(userIsAdminOrBetaTester([scopes.admin])).toBe(true)
  })

  test('Should be true for a beta tester', () => {
    expect(userIsAdminOrBetaTester([scopes.tenant, betaTesterScope])).toBe(true)
  })

  test('Should be false for a tenant without beta', () => {
    expect(userIsAdminOrBetaTester([scopes.tenant])).toBe(false)
  })

  test('Should be false with no scopes', () => {
    expect(userIsAdminOrBetaTester()).toBe(false)
  })
})

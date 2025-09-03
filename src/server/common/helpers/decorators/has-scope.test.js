import { scopes } from '@defra/cdp-validation-kit'

import { hasScopeDecorator } from './has-scope.js'

describe('#hasScopeDecorator', () => {
  test('Should return true when the user has the required scope', () => {
    const request = {
      auth: { credentials: { scope: [scopes.admin, scopes.externalTest] } }
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope(scopes.admin)).toBe(true)
  })

  test('Should return false when the user does not have the required scope', () => {
    const request = {
      auth: { credentials: { scope: [scopes.admin, scopes.externalTest] } }
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope(scopes.serviceOwner)).toBe(false)
  })

  test('Should return false when the user has no scopes', () => {
    const request = { auth: { credentials: { scope: [] } } }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope(scopes.externalTest)).toBe(false)
  })

  test('Should return false when the scope is undefined', () => {
    const request = {
      auth: { credentials: { scope: [scopes.admin, scopes.externalTest] } }
    }
    const hasScope = hasScopeDecorator(request)
    expect(hasScope()).toBe(false)
  })

  test('Should return false when the request object has no auth property', () => {
    const request = {}
    const hasScope = hasScopeDecorator(request)
    expect(hasScope(scopes.admin)).toBe(false)
  })

  test('Should return false when the credentials object is missing', () => {
    const request = { auth: {} }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope(scopes.externalTest)).toBe(false)
  })
})

import { hasScope } from './scopes.js'

describe('#hasScope', () => {
  test('Should return true if the user has the required scope', () => {
    const request = {
      auth: {
        credentials: {
          scope: ['admin', 'tenant']
        }
      }
    }
    expect(hasScope(request, 'admin')).toBe(true)
  })

  test('Should return false if the user does not have the required scope', () => {
    const request = {
      auth: {
        credentials: {
          scope: ['tenant']
        }
      }
    }
    expect(hasScope(request, 'admin')).toBe(false)
  })

  test('Should return false if the user has no scopes', () => {
    const request = {
      auth: {
        credentials: {
          scope: []
        }
      }
    }
    expect(hasScope(request, 'admin')).toBe(false)
  })

  test('Should return false if the request has no auth credentials', () => {
    const request = {
      auth: {}
    }
    expect(hasScope(request, 'admin')).toBe(false)
  })

  test('Should return false if the request has no auth object', () => {
    const request = {}
    expect(hasScope(request, 'admin')).toBe(false)
  })
})

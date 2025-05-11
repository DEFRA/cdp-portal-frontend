import { hasScopeDecorator } from '~/src/server/common/helpers/decorators/has-scope.js'

describe('#hasScopeDecorator', () => {
  test('Should return true if the user has the required scope', () => {
    const request = {
      auth: {
        credentials: {
          scope: ['admin', 'tenant']
        }
      }
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope('admin')).toBe(true)
  })

  test('Should return false if the user does not have the required scope', () => {
    const request = {
      auth: {
        credentials: {
          scope: ['tenant']
        }
      }
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope('admin')).toBe(false)
  })

  test('Should return false if the user has no scopes', () => {
    const request = {
      auth: {
        credentials: {
          scope: []
        }
      }
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope('admin')).toBe(false)
  })

  test('Should return false if the request has no auth credentials', () => {
    const request = {
      auth: {}
    }
    const hasScope = hasScopeDecorator(request)

    expect(hasScope('admin')).toBe(false)
  })

  test('Should return false if the request has no auth object', () => {
    const request = {}
    const hasScope = hasScopeDecorator(request)

    expect(hasScope('admin')).toBe(false)
  })
})

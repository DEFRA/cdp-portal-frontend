import Boom from '@hapi/boom'
import { provideNotFoundIfNull } from './provide-not-found-if-null.js'

describe('provideNotFoundIfNull', () => {
  test('Should return not found when entity is null', () => {
    const request = { app: { entity: null } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })

  test('Should continue when entity is valid', () => {
    const request = { app: { entity: { id: '1234' } } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should handle missing app object gracefully', () => {
    const request = {}
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })

  test('Should handle missing entity object gracefully', () => {
    const request = { app: {} }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })

  test('Should return not found when entity is undefined', () => {
    const request = { app: { entity: undefined } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })

  test('Should continue when entity is a non-null falsy value', () => {
    const request = { app: { entity: 0 } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should handle nullish coalescing operator correctly when entity is null', () => {
    const request = { app: { entity: null } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfNull.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })
})

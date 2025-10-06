import Boom from '@hapi/boom'

import { provideNotFoundIfPrototype } from './provide-not-found-if-prototype.js'
import { entitySubTypes, entityTypes } from '@defra/cdp-validation-kit'

describe('#provideNotFoundIfPrototype', () => {
  test('Should return not found when entity type is Prototype', () => {
    const request = {
      app: {
        entity: {
          type: entityTypes.microservice,
          subType: entitySubTypes.prototype
        }
      }
    }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfPrototype.method(request, h)

    expect(result).toEqual(Boom.notFound())
  })

  test('Should continue when entity is valid and not a Prototype', () => {
    const request = { app: { entity: { type: 'ValidType' } } }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfPrototype.method(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should handle missing app object gracefully', () => {
    const request = {}
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfPrototype.method(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should handle missing entity object gracefully', () => {
    const request = { app: {} }
    const h = { continue: Symbol('continue') }

    const result = provideNotFoundIfPrototype.method(request, h)

    expect(result).toBe(h.continue)
  })
})

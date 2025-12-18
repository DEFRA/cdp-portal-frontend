import { isBackendEntity, isFrontendEntity } from './entity-type.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

describe('#entity-type', () => {
  test('isFrontendEntity classifies frontends and prototypes as frontends', () => {
    expect(isFrontendEntity({ subType: entitySubTypes.frontend })).toBe(true)
    expect(isFrontendEntity({ subType: entitySubTypes.prototype })).toBe(true)
    expect(isFrontendEntity({ subType: entitySubTypes.backend })).toBe(false)
  })

  test('isBackendEntity classifies frontends and prototypes as frontends', () => {
    expect(isBackendEntity({ subType: entitySubTypes.frontend })).toBe(false)
    expect(isBackendEntity({ subType: entitySubTypes.prototype })).toBe(false)
    expect(isBackendEntity({ subType: entitySubTypes.backend })).toBe(true)
  })
})

import { entitySubTypes } from '@defra/cdp-validation-kit'

/**
 * Is a given entity a 'frontend' service (i.e. it has a UI)?
 * @param {{ subType: str }} entity
 * @returns {boolean}
 */
function isFrontendEntity(entity) {
  return (
    entity.subType === entitySubTypes.frontend ||
    entity.subType === entitySubTypes.prototype
  )
}

/**
 * Is a given entity a 'backend' service?
 * @param {{ subType: str }} entity
 * @returns {boolean}
 */
function isBackendEntity(entity) {
  return entity.subType === entitySubTypes.backend
}

export { isFrontendEntity, isBackendEntity }

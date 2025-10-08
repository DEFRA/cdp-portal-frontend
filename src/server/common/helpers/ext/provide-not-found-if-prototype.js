import Boom from '@hapi/boom'
import { entitySubTypes, entityTypes } from '@defra/cdp-validation-kit'

const provideNotFoundIfPrototype = {
  method: (request, h) => {
    const entity = request.app?.entity
    const isPrototype =
      entity?.type === entityTypes.microservice &&
      entity?.subType === entitySubTypes.prototype

    if (isPrototype) {
      return Boom.notFound()
    }

    return h.continue
  }
}

export { provideNotFoundIfPrototype }

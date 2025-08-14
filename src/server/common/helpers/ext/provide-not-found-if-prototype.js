import Boom from '@hapi/boom'

const provideNotFoundIfPrototype = {
  method: (request, h) => {
    const entity = request.app?.entity
    const isPrototype = entity?.type === 'Prototype'

    if (isPrototype) {
      return Boom.notFound()
    }

    return h.continue
  }
}

export { provideNotFoundIfPrototype }

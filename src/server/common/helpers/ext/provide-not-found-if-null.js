import Boom from '@hapi/boom'

const provideNotFoundIfNull = {
  method: (request, h) => {
    const entity = request.app?.entity ?? null

    if (entity === null) {
      return Boom.notFound()
    }

    return h.continue
  }
}

export { provideNotFoundIfNull }

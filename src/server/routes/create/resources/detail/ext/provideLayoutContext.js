export default function provideLayoutContext(resourceType) {
  return {
    type: 'onPostHandler',
    method: (request, h) => {
      if (request.response.variety !== 'view') {
        return h.continue
      }
      const response = request.response
      response.source.context = response.source.context
        ? response.source.context
        : {}

      const uuid = request.params.uuid

      response.source.context.actionLabel = uuid ? 'Edit' : 'Create'
      response.source.context.resourceTypeLabel = resourceType

      return h.continue
    },
    options: { sandbox: 'plugin' }
  }
}

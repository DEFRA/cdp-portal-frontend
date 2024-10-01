import { isCreateFeatureEnabled } from '~/src/server/create/helpers/feature/create-feature-flag'

const createDisabledController = {
  handler: (request, h) => {
    if (isCreateFeatureEnabled()) {
      request.logger.debug('Create feature is actually enabled')
      return h.redirect('/create')
    }

    return h.view('create/views/disabled', {
      pageTitle: 'Create disabled',
      heading: 'Create service disabled'
    })
  }
}

export { createDisabledController }

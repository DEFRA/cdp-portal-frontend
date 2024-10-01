import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'

const createDisabledController = {
  handler: (request, h) => {
    if (!isCreateFeatureTemporaryDisabled(request)) {
      request.logger.debug('Create feature is not disabled')
      // Redirect to home page, not /create to avoid infinite loop if cached
      return h.redirect('/')
    }

    return h.view('create/views/disabled', {
      pageTitle: 'Create disabled',
      heading: 'Create service disabled'
    })
  }
}

export { createDisabledController }

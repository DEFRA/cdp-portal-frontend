import {
  enableFeatureToggle,
  removeFeatureToggle
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

const activateCreateServiceDisabledController = {
  handler: async (request, h) => {
    await enableFeatureToggle(request.featureToggles, 'create-service-disabled')
    return h.redirect(`/admin/features`)
  }
}

const deactivateCreateServiceDisabledController = {
  handler: async (request, h) => {
    await removeFeatureToggle(request.featureToggles, 'create-service-disabled')
    return h.redirect(`/admin/features`)
  }
}

export {
  activateCreateServiceDisabledController,
  deactivateCreateServiceDisabledController
}

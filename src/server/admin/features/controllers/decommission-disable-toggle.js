import {
  enableFeatureToggle,
  removeFeatureToggle
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

const activateDecommissionDisabledController = {
  handler: async (request, h) => {
    await enableFeatureToggle(request.featureToggles, 'decommission-disabled')
    return h.redirect(`/admin/features`)
  }
}

const deactivateDecommissionDisabledController = {
  handler: async (request, h) => {
    await removeFeatureToggle(request.featureToggles, 'decommission-disabled')
    return h.redirect(`/admin/features`)
  }
}

export {
  activateDecommissionDisabledController,
  deactivateDecommissionDisabledController
}

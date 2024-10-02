import {
  enableFeatureToggle,
  removeFeatureToggle
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

const enableCreateServiceDisabledToggleController = {
  handler: async (request, h) => {
    await enableFeatureToggle(
      request.featureToggles,
      'create-service-temporary-disabled'
    )
    return h.redirect(`/admin/features`)
  }
}

const expireCreateServiceDisabledToggleController = {
  handler: async (request, h) => {
    await removeFeatureToggle(
      request.featureToggles,
      'create-service-temporary-disabled'
    )
    return h.redirect(`/admin/features`)
  }
}

export {
  enableCreateServiceDisabledToggleController,
  expireCreateServiceDisabledToggleController
}

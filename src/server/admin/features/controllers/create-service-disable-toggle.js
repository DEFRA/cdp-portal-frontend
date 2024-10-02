import {
  enableFeatureToggle,
  removeFeatureToggle
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

const enableCreateServiceDisabledToggleController = {
  handler: (request, h) => {
    request.logger('Create service disabled toggle enabled')
    enableFeatureToggle(
      request.featureToggles,
      'create-service-temporary-disabled'
    )
    return h.redirect(`/admin/features`)
  }
}

const expireCreateServiceDisabledToggleController = {
  handler: (request, h) => {
    request.logger('Create service disabled toggle expired')
    removeFeatureToggle(
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

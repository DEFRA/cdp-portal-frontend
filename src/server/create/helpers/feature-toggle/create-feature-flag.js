import { isFeatureToggleEnabled } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

function isCreateFeatureTemporaryDisabled(request) {
  return isFeatureToggleEnabled(
    request.featureToggles,
    'create-service-temporary-disabled'
  )
}

export { isCreateFeatureTemporaryDisabled }

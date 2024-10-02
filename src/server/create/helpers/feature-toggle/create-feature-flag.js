import {
  findFeatureToggle,
  isFeatureToggleEnabled
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

async function isCreateServiceFeatureDisabled(request) {
  return isFeatureToggleEnabled(
    request.featureToggles,
    'create-service-disabled'
  )
}

async function findCreateServiceFeatureDisabled(request) {
  return findFeatureToggle(request.featureToggles, 'create-service-disabled')
}

export { findCreateServiceFeatureDisabled, isCreateServiceFeatureDisabled }

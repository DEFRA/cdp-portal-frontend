import { isFeatureToggleEnabled } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

async function isCreateServiceFeatureDisabled(request) {
  const toggle = await isFeatureToggleEnabled(
    request.featureToggles,
    'create-service-disabled'
  )
  if (!toggle) {
    return false
  }
  return toggle
}

export { isCreateServiceFeatureDisabled }

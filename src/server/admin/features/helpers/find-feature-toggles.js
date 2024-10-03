import { findFeatureToggle } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup'

async function findAllFeatureToggles(request) {
  const createDisabled = await findFeatureToggle(
    request.featureToggles,
    'create-service-disabled'
  )
  const featureToggles = [
    {
      title: 'Disable Create Service',
      enabled: createDisabled?.enabled ?? false,
      created: createDisabled?.created,
      urlPrefix: '/admin/features/create-service-disabled'
    }
  ]
  return featureToggles
}

export { findAllFeatureToggles }

import { findFeatureToggle } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

async function findAllFeatureToggles(request) {
  const createDisabled = await findFeatureToggle(
    request.featureToggles,
    'create-service-disabled'
  )
  const decommissionDisabled = await findFeatureToggle(
    request.featureToggles,
    'decommission-disabled'
  )
  return [
    {
      title: 'Disable Create Service',
      enabled: createDisabled?.enabled ?? false,
      created: createDisabled?.created,
      urlPrefix: '/admin/features/create-service-disabled'
    },
    {
      title: 'Disable Decommissions',
      enabled: decommissionDisabled?.enabled ?? false,
      created: decommissionDisabled?.created,
      urlPrefix: '/admin/features/decommission-disabled'
    }
  ]
}

export { findAllFeatureToggles }

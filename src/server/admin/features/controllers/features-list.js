import { findCreateServiceFeatureDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'
import { transformFeaturesToEntityRows } from '~/src/server/admin/features/transformers/transform-feature-to-entity-row'

const listFeaturesController = {
  handler: async (request, h) => {
    const createDisabled = await findCreateServiceFeatureDisabled(request)
    const featureToggles = [
      {
        title: 'Disable Create Service',
        enabled: createDisabled?.enabled || false,
        created: createDisabled?.created,
        urlPrefix: '/admin/features/create-service-disabled'
      }
    ]
    const entityRows = transformFeaturesToEntityRows(featureToggles)
    const title = 'Feature Toggles'
    return h.view('admin/features/views/features-list', {
      pageTitle: title,
      heading: title,
      entityRows,
      headingCaption: 'Core Delivery Platform Temporary Feature Toggles'
    })
  }
}

export { listFeaturesController }

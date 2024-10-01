import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'
import { transformFeaturesToEntityRows } from '~/src/server/admin/features/transformers/transform-feature-to-entity-row'

const listFeaturesController = {
  handler: (request, h) => {
    const createFeatureTemporaryDisabled =
      isCreateFeatureTemporaryDisabled(request)
    const featureToggles = {
      createServiceDisabled: {
        title: 'Disable Create Service',
        enabled: createFeatureTemporaryDisabled,
        urlPrefix: '/admin/features/create-service-disabled'
      }
    }
    const entityRows = transformFeaturesToEntityRows(
      featureToggles,
      request.logger
    )
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

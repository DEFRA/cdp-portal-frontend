import { transformFeaturesToEntityRows } from '~/src/server/admin/features/transformers/transform-feature-to-entity-row'
import { findAllFeatureToggles } from '~/src/server/admin/features/helpers/find-feature-toggles'

const listFeaturesController = {
  handler: async (request, h) => {
    const featureToggles = await findAllFeatureToggles(request)
    const entityRows = transformFeaturesToEntityRows(featureToggles)
    return h.view('admin/features/views/features-list', {
      pageTitle: 'Admin - Feature Toggles',
      heading: 'Feature Toggles',
      entityRows,
      headingCaption: 'CDP Portal Temporary Feature Toggles'
    })
  }
}

export { listFeaturesController }

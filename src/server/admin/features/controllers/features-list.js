import { findAllFeatureToggles } from '~/src/server/admin/features/helpers/find-feature-toggles.js'
import { transformFeaturesToEntityRows } from '~/src/server/admin/features/transformers/transform-feature-to-entity-row.js'

const listFeaturesController = {
  handler: async (request, h) => {
    const featureToggles = await findAllFeatureToggles(request)
    const entityRows = transformFeaturesToEntityRows(featureToggles)
    return h.view('admin/features/views/features-list', {
      pageTitle: 'Admin - Feature Toggles',
      entityRows
    })
  }
}

export { listFeaturesController }

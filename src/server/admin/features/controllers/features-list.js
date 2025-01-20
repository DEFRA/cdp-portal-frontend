import { findAllFeatureToggles } from '~/src/server/admin/features/helpers/find-feature-toggles.js'
import { transformFeaturesToEntityRows } from '~/src/server/admin/features/transformers/transform-feature-to-entity-row.js'

const listFeaturesController = {
  handler: async (request, h) => {
    const featureToggles = await findAllFeatureToggles(request)
    const rows = transformFeaturesToEntityRows(featureToggles)

    return h.view('admin/features/views/features-list', {
      pageTitle: 'Admin - Feature Toggles',
      tableData: {
        headers: [
          { id: 'feature', text: 'Feature', width: '15' },
          { id: 'status', text: 'Status', width: '10' },
          { id: 'activated', text: 'Activated', width: '10' },
          { id: 'actions', text: 'Actions', width: '20' }
        ],
        rows,
        noResult: 'No feature flags found'
      }
    })
  }
}

export { listFeaturesController }

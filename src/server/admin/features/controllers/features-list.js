import { featureToEntityRow } from '~/src/server/admin/features/transformers/feature-to-entity-row.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

const listFeaturesController = {
  handler: async (request, h) => {
    const featureToggles = await request.featureToggles.getAll()
    const rows = featureToggles
      .toSorted(sortBy('name', 'asc'))
      .map(featureToEntityRow)

    return h.view('admin/features/views/features-list', {
      pageTitle: 'Admin - Feature Toggles',
      tableData: {
        headers: [
          { id: 'feature', text: 'Feature', width: '15' },
          { id: 'url', text: 'Url', width: '20' },
          { id: 'status', text: 'Status', width: '15' },
          { id: 'enabled', text: 'Enabled', width: '20' },
          { id: 'expires', text: 'Expires', width: '20' },
          { id: 'actions', text: 'Actions', width: '10' }
        ],
        rows,
        noResult: 'No feature flags found'
      }
    })
  }
}

export { listFeaturesController }

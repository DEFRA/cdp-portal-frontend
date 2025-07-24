import { featureToEntityRow } from '../transformers/feature-to-entity-row.js'
import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { fetchFeatureToggles } from '../helpers/fetch-feature-toggles.js'

const listFeaturesController = {
  handler: async (_request, h) => {
    const featureToggles = await fetchFeatureToggles()
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
          { id: 'actions', text: 'Actions', width: '10' }
        ],
        rows,
        noResult: 'No feature flags found'
      }
    })
  }
}

export { listFeaturesController }

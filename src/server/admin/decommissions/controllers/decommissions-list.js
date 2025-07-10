import { fetchDecommissions } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { transformDecommissionToRow } from '~/src/server/admin/decommissions/transformers/decommission-to-row.js'

const decommissionsListController = {
  handler: async (request, h) => {
    const decommissionedEntities = await fetchDecommissions()
    const rows = decommissionedEntities.map(transformDecommissionToRow)

    return h.view('admin/decommissions/views/decommissions-list', {
      pageTitle: 'Decommissions',
      tableData: {
        headers: [
          { id: 'value', text: 'Name', width: '40' },
          { id: 'by', text: 'By', width: '20' },
          { id: 'on', text: 'On', width: '20' },
          { id: 'status', text: 'Status', width: '20' }
        ],
        rows,
        noResult: 'No decommissions found'
      }
    })
  }
}

export { decommissionsListController }

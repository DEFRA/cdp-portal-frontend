import { creationStatuses } from '../../../common/constants/creation-statuses.js'
import { statusTagClassMap } from '../../../common/helpers/status-tag-class-map.js'
import { fetchDecommissions } from '../../../common/helpers/fetch/fetch-entities.js'
import { transformDecommissionToRow } from '../transformers/decommission-to-row.js'

const decommissionsListController = {
  options: {
    id: 'admin/decommissions'
  },
  handler: async (request, h) => {
    const decommissionedEntities = await fetchDecommissions()
    const rows = decommissionedEntities.map((entity) =>
      transformDecommissionToRow({
        ...entity,
        statusClass: statusTagClassMap(entity.status)
      })
    )
    const hasInProgressEntity = decommissionedEntities.some(
      (entity) => entity.status === creationStatuses.decommissioning
    )
    const poll = { count: 0 }
    const shouldPoll = hasInProgressEntity && poll.count === 0

    // Provide a final xhr fetch after the decommissioning process has finished
    if (!hasInProgressEntity) {
      poll.count += 1
    }

    const faviconState = shouldPoll ? 'pending' : 'success'

    return h.view('admin/decommissions/views/decommissions-list', {
      faviconState,
      pageTitle: 'Decommissions',
      tableData: {
        headers: [
          { id: 'name', text: 'Name', width: '20', isLeftAligned: true },
          { id: 'type', text: 'Type', width: '15' },
          { id: 'status', text: 'Status', width: '15' },
          { id: 'started', text: 'Started', width: '20' },
          { id: 'duration', text: 'Duration', width: '15' },
          { id: 'by', text: 'By', width: '15' }
        ],
        rows,
        noResult: 'No decommissions found'
      },
      shouldPoll
    })
  }
}

export { decommissionsListController }

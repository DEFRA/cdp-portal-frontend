import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { fetchDecommissions } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { transformDecommissionToRow } from '~/src/server/admin/decommissions/transformers/decommission-to-row.js'

const decommissionsListController = {
  options: {
    id: 'admin/decommissions'
  },
  handler: async (request, h) => {
    const decommissionedEntities = await fetchDecommissions()
    const rows = decommissionedEntities
      .toSorted(sortBy('name', 'asc'))
      .map((entity) =>
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
          { id: 'type', text: 'Type', width: '10' },
          { id: 'status', text: 'Status', width: '15' },
          { id: 'started', text: 'Started', width: '20' },
          { id: 'duration', text: 'Duration', width: '20' },
          { id: 'by', text: 'By', width: '20' }
        ],
        rows,
        noResult: 'No decommissions found'
      },
      shouldPoll
    })
  }
}

export { decommissionsListController }

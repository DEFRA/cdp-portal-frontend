import { fetchAudit } from '../../../common/helpers/fetch/fetch-audit.js'
import { transformAuditToRow } from '../transformers/audit-to-row.js'

const auditListController = {
  options: {
    id: 'admin/audit'
  },
  handler: async (request, h) => {
    const audits = await fetchAudit()
    const rows = audits.map(transformAuditToRow)

    return h.view('admin/audit/views/audit-list', {
      pageTitle: 'Audit',
      tableData: {
        headers: [
          { id: 'performedBy', text: 'Performed By', width: '12' },
          { id: 'action', text: 'Action', width: '12' },
          { id: 'performedAt', text: 'Performed At', width: '12' },
          { id: 'user', text: 'User', width: '10' },
          { id: 'team', text: 'Team', width: '8' },
          { id: 'service', text: 'Service', width: '10' },
          { id: 'duration', text: 'Duration', width: '10' },
          { id: 'reason', text: 'Reason', width: '15' }
        ],
        rows,
        noResult: 'No audit found'
      }
    })
  }
}

export { auditListController }

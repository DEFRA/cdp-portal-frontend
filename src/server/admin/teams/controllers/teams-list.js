import { fetchCdpTeams } from '../helpers/fetch/index.js'
import { transformTeamToEntityRow } from '../transformers/transform-team-to-entity-row.js'

const teamsListController = {
  options: {
    id: 'admin/teams'
  },
  handler: async (request, h) => {
    const teams = await fetchCdpTeams()
    const rows = teams?.map(transformTeamToEntityRow)

    return h.view('admin/teams/views/teams-list', {
      pageTitle: 'Teams',
      tableData: {
        headers: [
          { id: 'name', text: 'Name', width: '10' },
          { id: 'description', text: 'Description', width: '15' },
          { id: 'github-team', text: 'GitHub Team', width: '10' },
          { id: 'service-codes', text: 'Service Codes', width: '5' },
          { id: 'alert-emails', text: 'Alert Emails', width: '15' },
          { id: 'alert-environments', text: 'Alert Environments', width: '15' },
          { id: 'members', text: 'Members', width: '6' },
          { id: 'last-updated', text: 'Last Updated', width: '13' },
          { id: 'created', text: 'Created', width: '13' }
        ],
        rows,
        noResult: 'No teams found'
      }
    })
  }
}

export { teamsListController }

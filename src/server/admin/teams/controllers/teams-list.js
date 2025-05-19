import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row.js'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchCdpTeams()
    const rows = teams?.map(transformTeamToEntityRow)

    return h.view('admin/teams/views/teams-list', {
      pageTitle: 'Teams',
      tableData: {
        headers: [
          { id: 'name', text: 'Name', width: '15' },
          { id: 'description', text: 'Description', width: '15' },
          { id: 'github-team', text: 'GitHub Team', width: '15' },
          { id: 'service-codes', text: 'Service Codes', width: '5' },
          { id: 'alert-emails', text: 'Alert Emails', width: '20' },
          { id: 'alert-environments', text: 'Alert Environments', width: '20' },
          { id: 'members', text: 'Members', width: '10' },
          { id: 'last-updated', text: 'Last Updated', width: '10' },
          { id: 'created', text: 'Created', width: '10' }
        ],
        rows,
        noResult: 'No teams found'
      }
    })
  }
}

export { teamsListController }

import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { provideCdpTeam } from '../../helpers/pre/provide-cdp-team.js'
import { transformSummaryTeamRows } from '../../transformers/transform-summary-team-rows.js'

const teamSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const isEdit = cdpTeam.isEdit ?? false
    const updateOrCreate = isEdit ? 'Edit' : 'Create'

    return h.view('admin/teams/views/save/summary', {
      pageTitle: `${updateOrCreate} Team Summary`,
      teamRows: transformSummaryTeamRows(cdpTeam),
      formButtonText: isEdit ? 'Save' : 'Create',
      pageHeading: {
        text: cdpTeam.name,
        caption: isEdit ? 'Edit Team Summary' : 'Create Team Summary'
      },
      isEdit,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: updateOrCreate
        }
      ]
    })
  }
}

export { teamSummaryController }

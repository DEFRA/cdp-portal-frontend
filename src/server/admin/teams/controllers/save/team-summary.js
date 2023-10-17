import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'
import { transformSummaryTeamRows } from '~/src/server/admin/teams/transformers/transform-summary-team-rows'

const teamSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const isEdit = cdpTeam.isEdit ?? false

    const heading = isEdit ? 'Edit team summary' : 'Create team summary'

    return h.view('admin/teams/views/save/summary', {
      pageTitle: heading,
      heading,
      headingCaption:
        'Information about the Core Delivery Platform (CDP) team you are going to create.',
      teamRows: transformSummaryTeamRows(cdpTeam),
      formButtonText: isEdit ? 'Save' : 'Create',
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
          text: `${isEdit ? 'Edit' : 'Create'} team`
        }
      ]
    })
  }
}

export { teamSummaryController }

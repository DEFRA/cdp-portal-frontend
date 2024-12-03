import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect.js'

const teamDetailsFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: (request, h) => {
    const query = request?.query
    const redirectLocation = query?.redirectLocation

    const cdpTeam = request.pre?.cdpTeam
    const isEdit = cdpTeam?.isEdit

    const updateOrCreate = isEdit ? 'Edit' : 'Create'

    return h.view('admin/teams/views/save/team-details-form', {
      pageTitle: `${updateOrCreate} Team`,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      pageHeading: {
        text: isEdit ? 'Edit' : 'Create New'
      },
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

export { teamDetailsFormController }

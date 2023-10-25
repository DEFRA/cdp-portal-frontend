import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect'

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
    const heading = `${updateOrCreate} CDP team`

    return h.view('admin/teams/views/save/team-details-form', {
      pageTitle: heading,
      heading,
      headingCaption: `${updateOrCreate} Core Delivery Platform (CDP) team`,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
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
          text: updateOrCreate + ' team'
        }
      ]
    })
  }
}

export { teamDetailsFormController }

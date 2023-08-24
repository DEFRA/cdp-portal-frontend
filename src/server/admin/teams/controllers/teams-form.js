import { populateCdpTeam } from '~/src/server/admin/teams/helpers/extensions/populate-cdp-team'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'
import { appConfig } from '~/src/config'

const teamsFormController = {
  options: {
    ext: {
      onPreHandler: populateCdpTeam
    },
    pre: [provideCdpTeam]
  },
  handler: (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const isEdit = cdpTeam?.isEdit

    const updateOrCreate = isEdit ? 'Update' : 'Create'
    const heading = `${updateOrCreate} team`

    return h.view('admin/teams/views/team-form', {
      pageTitle: heading,
      heading,
      headingCaption: `${updateOrCreate} Core Delivery Platform (CDP) team`,
      formButtonText: updateOrCreate,
      action: isEdit ? `edit/${cdpTeam.teamId}` : 'create',
      breadcrumbs: [
        {
          text: 'Admin',
          href: appConfig.get('appPathPrefix') + '/admin'
        },
        {
          text: 'Teams',
          href: appConfig.get('appPathPrefix') + '/admin/teams'
        },
        {
          text: updateOrCreate + ' team'
        }
      ]
    })
  }
}

export { teamsFormController }

import { populateCdpTeam } from '~/src/server/admin/teams/helpers/extensions/populate-cdp-team'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'

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

    const updateOrCreate = isEdit ? 'Edit' : 'Create'
    const saveOrCreate = isEdit ? 'Save' : 'Create'
    const heading = `${updateOrCreate} team`

    return h.view('admin/teams/views/team-form', {
      pageTitle: heading,
      heading,
      headingCaption: `${updateOrCreate} Core Delivery Platform (CDP) team`,
      formButtonText: saveOrCreate,
      action: isEdit ? `edit/${cdpTeam.teamId}` : 'create',
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

export { teamsFormController }

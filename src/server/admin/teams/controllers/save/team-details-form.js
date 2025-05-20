import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { environments } from '~/src/config/environments.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

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

    const alertEnvironmentsCheckboxes = getEnvironments(
      request.auth.credentials?.scope
    ).map((env) => {
      return {
        value: env,
        text: formatText(env),
        checked:
          cdpTeam.alertEnvironments?.includes(env) === true ||
          (env === environments.prod.kebabName && !isEdit) // prod checked by default when creating new team
      }
    })

    return h.view('admin/teams/views/save/team-details-form', {
      pageTitle: `${updateOrCreate} Team`,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      pageHeading: {
        text: isEdit ? 'Edit' : 'Create New'
      },
      alertEnvironmentsCheckboxes,
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

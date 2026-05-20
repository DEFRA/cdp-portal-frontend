import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { environments } from '../../../../../config/environments.js'
import { formatText } from '../../../../../config/nunjucks/filters/filters.js'

const teamDetailsFormController = {
  options: {
    // pre: [provideCdpTeam]
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
      splitPaneBreadcrumbs: [
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

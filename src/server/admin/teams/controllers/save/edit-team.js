import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/teams/helpers/form'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect'

const editTeamController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam

    const editTeamEndpointUrl =
      config.get('userServiceApiUrl') + '/teams/' + cdpTeam.teamId

    const response = await request.fetchWithAuth(editTeamEndpointUrl, {
      method: 'patch',
      body: JSON.stringify({
        name: cdpTeam.name,
        description: cdpTeam.description,
        github: cdpTeam.github
      })
    })
    const json = await response.json()

    if (response.ok) {
      await setStepComplete(request, h, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'Team updated',
        type: 'success'
      })

      return h.redirect(
        config.get('appPathPrefix') + '/admin/teams/' + cdpTeam.teamId
      )
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(config.get('appPathPrefix') + '/admin/teams/summary')
  }
}

export { editTeamController }

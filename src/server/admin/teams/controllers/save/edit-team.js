import { editTeam } from '~/src/server/admin/teams/helpers/fetch'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/teams/helpers/form'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team'
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

    const { json, response } = await editTeam(request, cdpTeam.teamId, {
      name: cdpTeam.name,
      description: cdpTeam.description,
      github: cdpTeam.github
    })

    if (response.ok) {
      await setStepComplete(request, h, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'Team updated',
        type: 'success'
      })

      return h.redirect('/admin/teams/' + cdpTeam.teamId)
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect('/admin/teams/summary')
  }
}

export { editTeamController }

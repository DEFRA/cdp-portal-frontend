import { editTeam } from '../../helpers/fetch/fetchers.js'
import { sessionNames } from '../../../../common/constants/session-names.js'

const editTeamController = {
  options: {
    // pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam

    try {
      await editTeam(request, cdpTeam.teamId, {
        name: cdpTeam.name,
        description: cdpTeam.description,
        github: cdpTeam.github,
        serviceCodes: cdpTeam.serviceCode ? [cdpTeam.serviceCode] : [],
        alertEmailAddresses: cdpTeam.alertEmailAddresses,
        alertEnvironments: cdpTeam.alertEnvironments
      })

      // await setStepComplete(request, h, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'Team updated',
        type: 'success'
      })

      return h.redirect('/admin/teams/' + cdpTeam.teamId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/teams/summary')
    }
  }
}

export { editTeamController }

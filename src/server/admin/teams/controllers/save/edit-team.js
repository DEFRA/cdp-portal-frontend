import { editTeam } from '../../helpers/fetch/fetchers.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'

const editTeamController = {
  options: {
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId

    try {
      await editTeam(request, cdpTeam.teamId, {
        name: cdpTeam.name,
        description: cdpTeam.description,
        github: cdpTeam.github,
        serviceCodes: cdpTeam.serviceCode ? [cdpTeam.serviceCode] : [],
        alertEmailAddresses: cdpTeam.alertEmailAddresses,
        alertEnvironments: cdpTeam.alertEnvironments
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Team updated',
        type: 'success'
      })

      return h.redirect('/admin/teams/' + cdpTeam.teamId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/teams/summary/${multiStepFormId}`)
    }
  }
}

export { editTeamController }

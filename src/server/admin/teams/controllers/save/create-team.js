import { config } from '#config/config.js'
import { removeNil } from '#server/common/helpers/remove-nil.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import Joi from 'joi'

const createTeamController = {
  handler: async (request, h) => {
    const cdpTeam = request.pre?.stepData
    const endpoint = config.get('userServiceBackendUrl') + '/teams'

    try {
      await request.authedFetchJson(endpoint, {
        method: 'post',
        payload: removeNil({
          name: cdpTeam.name,
          description: cdpTeam.description,
          github: cdpTeam.github,
          serviceCodes: cdpTeam.serviceCode ? [cdpTeam.serviceCode] : [],
          alertEmailAddresses: cdpTeam.alertEmailAddresses
        })
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Team created',
        type: 'success'
      })

      return h.redirect('/admin/teams')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/teams/summary`)
    }
  }
}

export { createTeamController }

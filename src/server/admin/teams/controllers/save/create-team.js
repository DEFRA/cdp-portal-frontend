import { config } from '../../../../../config/config.js'
import { removeNil } from '../../../../common/helpers/remove-nil.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'
import Joi from 'joi'

const createTeamController = {
  options: {
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId
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

      return h.redirect(`/admin/teams/summary/${multiStepFormId}`)
    }
  }
}

export { createTeamController }

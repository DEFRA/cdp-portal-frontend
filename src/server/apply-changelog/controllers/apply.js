import Joi from 'joi'

import { config } from '../../../config/config.js'
import { sessionNames } from '../../common/constants/session-names.js'
import { provideStepData } from '../../common/helpers/multistep-form/provide-step-data.js'

const applyController = {
  options: {
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const stepData = request.pre.stepData
    const multiStepFormId = request.app.multiStepFormId
    const runApplyChangelogEndpointUrl =
      config.get('selfServiceOpsUrl') + '/deploy-database-migration'

    try {
      const { payload } = await request.authedFetchJson(
        runApplyChangelogEndpointUrl,
        {
          method: 'post',
          payload: {
            service: stepData.serviceName,
            version: stepData.version,
            environment: stepData.environment
          }
        }
      )

      // Remove step payload session
      request.yar.clear(multiStepFormId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Database changelog update successfully requested',
        type: 'success'
      })

      const migrationId = payload?.migrationId

      request.audit.sendMessage({
        event: `database changelog apply requested: ${stepData.serviceName}:${stepData.version} to ${stepData.environment} with config ${request.payload.configVersion} by ${userSession.id}:${userSession.email}`,
        data: {
          serviceName: stepData.serviceName,
          environment: stepData.environment
        },
        user: userSession
      })

      return h.redirect(
        `/deployments/database-updates/${stepData.environment}/${migrationId}`
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/apply-changelog/summary/${multiStepFormId}`)
    }
  }
}

export { applyController }

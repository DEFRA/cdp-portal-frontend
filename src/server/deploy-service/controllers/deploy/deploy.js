import Joi from 'joi'

import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideAuthedUser } from '../../../common/helpers/auth/pre/provide-authed-user.js'
import { provideStepData } from '../../../common/helpers/multistep-form/provide-step-data.js'

const deployController = {
  options: {
    pre: [provideStepData, provideAuthedUser],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const stepData = request.pre.stepData
    const multiStepFormId = request.app.multiStepFormId
    const deployServiceEndpointUrl =
      config.get('selfServiceOpsUrl') + '/deploy-service'

    try {
      const { payload } = await request.authedFetchJson(
        deployServiceEndpointUrl,
        {
          method: 'post',
          payload: {
            imageName: stepData.imageName,
            version: stepData.version,
            environment: stepData.environment,
            instanceCount: stepData.instanceCount,
            cpu: stepData.cpu,
            memory: stepData.memory,
            configVersion: request.payload.configVersion
          }
        }
      )

      // Remove step payload session
      request.yar.clear(multiStepFormId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Deployment successfully requested',
        type: 'success'
      })

      const deploymentId = payload.deploymentId

      request.audit.sendMessage({
        event: `deployment requested: ${stepData.imageName}:${stepData.version} to ${stepData.environment} with config ${request.payload.configVersion} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
        data: {
          imageName: stepData.imageName,
          environment: stepData.environment
        },
        user: request.pre.authedUser
      })

      return h.redirect(`/deployments/${stepData.environment}/${deploymentId}`)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/deploy-service/summary/${multiStepFormId}`)
    }
  }
}

export { deployController }

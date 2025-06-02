import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { fetchLatestDeployment } from '~/src/server/common/helpers/fetch/fetch-latest-deployment.js'

const undeployController = {
  options: {
    pre: [provideAuthedUser]
    // validate: {
    //   params: Joi.object({
    //     multiStepFormId: Joi.string().uuid().required()
    //   })
    // }
  },
  handler: async (request, h) => {
    // const stepData = request.pre.stepData
    // const multiStepFormId = request.app.multiStepFormId
    const environment = request.params.environment
    const serviceName = request.params.serviceName
    const deployment = await fetchLatestDeployment(
      serviceName,
      environment,
      request.logger
    )

    const version = deployment.service.version
    const configVersion = deployment.service.configuration.commitSha

    const deployServiceEndpointUrl =
      config.get('selfServiceOpsUrl') + '/deploy-service'

    try {
      // todo refactor to method
      const { payload } = await request.authedFetchJson(
        deployServiceEndpointUrl,
        {
          method: 'post',
          payload: {
            imageName: serviceName,
            version,
            environment,
            instanceCount: 0,
            cpu: deployment.resources.cpu,
            memory: deployment.resources.memory,
            configVersion
          }
        }
      )

      // // Remove step payload session
      // request.yar.clear(multiStepFormId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Deployment successfully requested',
        type: 'success'
      })

      const deploymentId = payload.deploymentId

      request.audit.sendMessage({
        event: `deployment requested: ${serviceName}:${version} to ${environment} with config ${configVersion} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
        data: {
          imageName: serviceName,
          environment
        },
        user: request.pre.authedUser
      })

      return h.redirect(`/deployments/${environment}/${deploymentId}`)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(
        `/services/${serviceName}/undeploy-service/${environment}`
      )
    }
  }
}

export { undeployController }

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/deploy-service/helpers/form'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'

const deployController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment, provideAuthedUser]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment
    const deployServiceEndpointUrl =
      config.get('selfServiceOpsApiUrl') + '/deploy-service'

    try {
      const { json, response } = await request.authedFetcher(
        deployServiceEndpointUrl,
        {
          method: 'post',
          body: JSON.stringify({
            imageName: deployment.imageName,
            version: deployment.version,
            environment: deployment.environment,
            instanceCount: deployment.instanceCount,
            cpu: deployment.cpu,
            memory: deployment.memory
          })
        }
      )

      if (response.ok) {
        await setStepComplete(request, h, 'allSteps')

        request.yar.flash(sessionNames.notifications, {
          text: 'Deployment successfully requested',
          type: 'success'
        })

        const deploymentId = json.deploymentId

        request.audit.sendMessage({
          event: `deployment requested: ${deployment.imageName}:${deployment.version} to ${deployment.environment} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
          user: request.pre.authedUser
        })

        return h.redirect(
          `/deployments/${deployment.environment}/${deploymentId}`
        )
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/deploy-service/summary')
    }
  }
}

export { deployController }

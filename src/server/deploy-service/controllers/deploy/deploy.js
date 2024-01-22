import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/deploy-service/helpers/form'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'

const deployController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment
    const deployServiceEndpointUrl =
      config.get('selfServiceOpsApiUrl') + '/deploy-service'

    const response = await request.fetchWithAuth(deployServiceEndpointUrl, {
      method: 'post',
      body: JSON.stringify({
        imageName: deployment.imageName,
        version: deployment.version,
        environment: deployment.environment,
        instanceCount: deployment.instanceCount,
        cpu: deployment.cpu,
        memory: deployment.memory
      })
    })

    const json = await response.json()

    if (response.ok) {
      await setStepComplete(request, h, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'Deployment successfully requested',
        type: 'success'
      })

      const deploymentId = json.deploymentId

      return h.redirect(
        `/deployments/${deployment.environment}/${deploymentId}`
      )
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect('/deploy-service/summary')
  }
}

export { deployController }

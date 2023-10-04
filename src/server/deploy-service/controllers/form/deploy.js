import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/deploy-service/helpers/form'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'

const deployController = {
  options: {
    pre: [noSessionRedirect, provideDeployment]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment
    const appPathPrefix = config.get('appPathPrefix')

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
      await setStepComplete(request, h, 'stepThree')
      await setStepComplete(request, h, 'allSteps')

      return h.redirect(appPathPrefix + '/deploy-service/deployment')
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(appPathPrefix + '/deploy-service/summary')
  }
}

export { deployController }
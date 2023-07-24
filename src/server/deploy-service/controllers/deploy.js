import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeploymentSession } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment-session'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'

const deployController = {
  options: {
    pre: [noSessionRedirect, provideDeploymentSession]
  },
  handler: (request, h) => {
    const logger = createLogger()
    const deploymentSession = request.pre?.deploymentSession

    const deployServiceEndpointUrl = `${appConfig.get(
      'selfServiceOpsApiUrl'
    )}/deploy-service`

    // Explicitly fire and forget
    fetch(deployServiceEndpointUrl, {
      method: 'post',
      body: JSON.stringify({
        imageName: deploymentSession.imageName,
        version: deploymentSession.version,
        environment: deploymentSession.environment,
        instanceCount: deploymentSession.instanceCount,
        cpu: deploymentSession.cpu,
        memory: deploymentSession.memory
      }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(logger.error)

    saveToDeploymentSession(request, { isSent: true })

    return h.redirect(
      appConfig.get('appPathPrefix') + '/deploy-service/deployment'
    )
  }
}

export { deployController }

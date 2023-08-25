import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'

const deployController = {
  options: {
    pre: [noSessionRedirect, provideDeployment]
  },
  handler: (request, h) => {
    const deployment = request.pre?.deployment

    const deployServiceEndpointUrl = `${appConfig.get(
      'selfServiceOpsApiUrl'
    )}/deploy-service`

    // Explicitly fire and forget
    // TODO add in page that shows feedback from platform
    fetch(deployServiceEndpointUrl, {
      method: 'post',
      body: JSON.stringify({
        imageName: deployment.imageName,
        version: deployment.version,
        environment: deployment.environment,
        instanceCount: deployment.instanceCount,
        cpu: deployment.cpu,
        memory: deployment.memory
      }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(request.logger.error)

    saveToDeploymentSession(request, { isSent: true })

    return h.redirect(
      appConfig.get('appPathPrefix') + '/deploy-service/deployment'
    )
  }
}

export { deployController }

import { appConfig } from '~/src/config'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

const deployController = {
  options: {
    pre: [noSessionRedirect, provideDeployment]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment
    const appPathPrefix = appConfig.get('appPathPrefix')

    const deployServiceEndpointUrl =
      appConfig.get('selfServiceOpsApiUrl') + '/deploy-service'

    const response = await fetchWithAuth(
      request.yar?.auth,
      deployServiceEndpointUrl,
      {
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

    const json = await response.json()

    if (response.ok) {
      saveToDeploymentSession(request, { isSent: true })

      return h.redirect(appPathPrefix + '/deploy-service/deployment')
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(appPathPrefix + '/deploy-service/summary')
  }
}

export { deployController }

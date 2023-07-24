import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeploymentSession } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment-session'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'

const deploymentController = {
  options: {
    pre: [noSessionRedirect, provideDeploymentSession]
  },
  handler: async (request, h) => {
    saveToDeploymentSession(request, { isComplete: true })

    return h.view('deploy-service/views/deployment', {
      pageTitle: 'Deploy Service deployment',
      heading: 'Deployment',
      headingCaption: 'Your deployments progress'
    })
  }
}

export { deploymentController }

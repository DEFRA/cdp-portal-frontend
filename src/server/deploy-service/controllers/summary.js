import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { transformDeploymentRows } from '~/src/server/deploy-service/transformers/transform-deployment-rows'
import { provideDeploymentSession } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment-session'

const summaryController = {
  options: {
    pre: [noSessionRedirect, provideDeploymentSession]
  },
  handler: async (request, h) => {
    const deploymentSession = request.pre?.deploymentSession

    return h.view('deploy-service/views/summary', {
      pageTitle: 'Deploy Service Summary',
      heading: 'Summary',
      headingCaption:
        'Information about the Micro-service you are going to deploy.',
      deploymentRows: await transformDeploymentRows(deploymentSession),
      formButtonText: 'Deploy'
    })
  }
}

export { summaryController }

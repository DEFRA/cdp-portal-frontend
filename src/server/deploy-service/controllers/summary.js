import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { transformDeploymentRows } from '~/src/server/deploy-service/transformers/transform-deployment-rows'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'

const summaryController = {
  options: {
    pre: [noSessionRedirect, provideDeployment]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment

    return h.view('deploy-service/views/summary', {
      pageTitle: 'Deploy Service Summary',
      heading: 'Summary',
      headingCaption:
        'Information about the Micro-service you are going to deploy.',
      deploymentRows: await transformDeploymentRows(deployment),
      formButtonText: 'Deploy'
    })
  }
}

export { summaryController }

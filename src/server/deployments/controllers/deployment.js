import Joi from 'joi'
import Boom from '@hapi/boom'
import { capitalize, isNull } from 'lodash'

import { environments } from '~/src/config'
import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment'

const deploymentController = {
  options: {
    pre: [provideDeployment],
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments)),
        deploymentId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const deployment = request.pre.deployment

    if (isNull(deployment)) {
      return null
    }

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.service} Service Deployment`,
      heading: 'Deployment',
      caption: 'Microservice deployment information.',
      deployment,
      tabBreadcrumbs: [
        {
          text: capitalize(deployment.environment),
          href: `/deployments/${deployment.environment}`
        },
        {
          text: `${deployment.service} - ${deployment.version}`
        }
      ]
    })
  }
}

export { deploymentController }

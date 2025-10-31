import Joi from 'joi'
import Boom from '@hapi/boom'
import { deploymentIdValidation } from '@defra/cdp-validation-kit'
import { fetchDeployment } from '../../../deployments/helpers/fetch/fetch-deployment.js'

export const deploymentDebugController = {
  options: {
    id: 'admin/debug/deployment/{deploymentId}',
    validate: {
      params: Joi.object({
        deploymentId: deploymentIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const deploymentId = request.params.deploymentId

    const deployment = await fetchDeployment(deploymentId)

    if (deployment == null) {
      return Boom.notFound()
    }

    return h.response(deployment).type('application/json')
  }
}

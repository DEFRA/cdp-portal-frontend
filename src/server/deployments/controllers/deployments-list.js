import Boom from '@hapi/boom'
import Joi from 'joi'

import { environments } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { deploymentTabs } from '~/src/server/deployments/helpers/deployment-tabs'
import { fetchDeployments } from '~/src/server/deployments/helpers/fetch-deployments'
import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'

const deploymentsListController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments))
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment
    const deployments = await fetchDeployments(request.params?.environment)

    const entityRows = deployments
      ?.sort(sortBy('deployedAt'))
      ?.map(transformDeploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      caption:
        'Micro-service deployment details across all available environments.',
      environment: environments[environment],
      tabs: deploymentTabs(request),
      entityRows
    })
  }
}

export { deploymentsListController }

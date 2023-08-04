import Joi from 'joi'
import Boom from '@hapi/boom'

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
      query: Joi.object({
        service: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment

    // TODO add Redis to cache these multiple calls
    const deployments = await fetchDeployments(
      environment,
      request?.query?.service
    )

    // TODO endpoint for unique deployment names / suggestions?
    const allDeployments = await fetchDeployments(environment)
    const uniqueAllDeployments = [
      ...new Set(allDeployments.map((deployment) => deployment.service))
    ]

    const entityRows = deployments
      ?.sort(sortBy('updatedAt'))
      ?.map(transformDeploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      caption:
        'Micro-service deployment details across all available environments.',
      tabs: deploymentTabs(request),
      suggestions: uniqueAllDeployments?.map((deployment) => ({
        label: deployment,
        value: deployment
      })),
      entityRows,
      environment
    })
  }
}

export { deploymentsListController }

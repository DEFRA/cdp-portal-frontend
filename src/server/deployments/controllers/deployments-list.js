import Joi from 'joi'
import { cloneDeep } from 'lodash'
import Boom from '@hapi/boom'

import { environments } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { deploymentTabs } from '~/src/server/deployments/helpers/deployment-tabs'
import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'
import { sortByName } from '~/src/server/common/helpers/sort-by-name'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { fetchDeployments } from '~/src/server/deployments/helpers/fetch-deployments'

// TODO fix - the progressive search is not quite right
const deploymentsListController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments))
      }),
      query: Joi.object({
        service: Joi.string().allow(''),
        user: Joi.string().allow(''),
        status: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment

    const deployments = await fetchDeployments(environment)
    const allDeployments = cloneDeep(deployments)

    const uniqueAllDeployments = [
      ...new Set(allDeployments.map((deployment) => deployment.service))
    ].sort(sortByName)

    const uniqueAllUsers = [
      ...new Set(allDeployments.map((deployment) => deployment.user))
    ].sort(sortByName)

    const uniqueAllStatus = [
      ...new Set(allDeployments.map((deployment) => deployment.status))
    ].sort(sortByName)

    const entityRows = deployments
      ?.sort(sortBy('updatedAt'))
      ?.map(transformDeploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      caption:
        'Microservice deployment details across all available environments.',
      tabs: deploymentTabs(request),
      searchSuggestions: buildOptions(uniqueAllDeployments),
      userSuggestions: buildOptions(uniqueAllUsers),
      statusSuggestions: buildOptions(uniqueAllStatus),
      entityRows,
      environment
    })
  }
}

export { deploymentsListController }

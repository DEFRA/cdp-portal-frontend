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
import { buildPagination } from '~/src/server/common/helpers/build-pagination'

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
        status: Joi.string().allow(''),
        page: Joi.number().default(1),
        size: Joi.number().default(20)
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment

    const { deployments, page, pageSize, totalPages } = await fetchDeployments(
      environment,
      { page: request.query?.page, size: request.query?.size }
    )
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
      ?.sort(sortBy('createdAt'))
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
      environment,
      pagination: buildPagination(page, pageSize, totalPages, request.query)
    })
  }
}

export { deploymentsListController }

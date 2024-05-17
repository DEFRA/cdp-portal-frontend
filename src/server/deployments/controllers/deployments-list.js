import Joi from 'joi'
import Boom from '@hapi/boom'
import { capitalize } from 'lodash'

import { environments } from '~/src/config'
import { deploymentsToEntityRow } from '~/src/server/deployments/transformers/deployments-to-entity-row'
import { fetchDeployments } from '~/src/server/deployments/helpers/fetch/fetch-deployments'
import { buildPagination } from '~/src/server/common/helpers/build-pagination'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions'
import { provideFormValues } from '~/src/server/deployments/helpers/ext/provide-form-values'

const deploymentsListController = {
  options: {
    ext: {
      onPreAuth: [allEnvironmentsOnlyForAdmin],
      onPostHandler: [provideFormValues]
    },
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments))
      }),
      query: Joi.object({
        service: Joi.string().allow(''),
        user: Joi.string().allow(''), // TODO this should be userId?
        status: Joi.string().allow(''),
        page: Joi.number().default(1),
        size: Joi.number().default(100)
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment

    const { data, page, pageSize, totalPages } = await fetchDeployments(
      environment,
      { page: request.query?.page, size: request.query?.size }
    )

    const entityRows = data?.map(deploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      caption: 'Microservice deployment details across all environments.',
      entityRows,
      environment,
      pagination: buildPagination(page, pageSize, totalPages, request.query),
      noResult: `Currently there are no deployments in ${capitalize(
        environment
      )}`
    })
  }
}

export { deploymentsListController }

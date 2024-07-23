import Joi from 'joi'
import Boom from '@hapi/boom'
import { capitalize, upperFirst } from 'lodash'
import { compose } from 'lodash/fp'

import { environments } from '~/src/config'
import { buildPagination } from '~/src/server/common/helpers/build-pagination'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions'
import { provideFormValues } from '~/src/server/deployments/helpers/ext/provide-form-values'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments'
import { deploymentEntityRows } from '~/src/server/deployments/transformers/deployment-entity-rows'
import { fetchDeployments } from '~/src/server/deployments/helpers/fetch/fetch-deployments'

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
        user: Joi.string().allow(''),
        status: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params?.environment

    const filtersResponse = await request.server.methods.fetchFilters()
    const serviceFilters = buildSuggestions(
      filtersResponse.filters.services.map((serviceName) => ({
        text: serviceName,
        value: serviceName
      }))
    )

    const userFilters = buildSuggestions(
      filtersResponse.filters.users.map((user) => ({
        text: user.displayName,
        value: user.id
      }))
    )

    const order = [
      'running',
      'requested',
      'pending',
      'stopped',
      'stopping',
      'undeployed'
    ]
    const statusFilters = buildSuggestions(
      filtersResponse.filters.statuses
        .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        .map((status) => ({
          text: upperFirst(status),
          value: status
        }))
    )

    const deploymentsResponse = await fetchDeployments(environment, {
      page: request.query?.page,
      size: request.query?.size,
      service: request.query.service,
      user: request.query.user,
      status: request.query.status
    })
    const deployments = deploymentsResponse?.data
    const page = deploymentsResponse?.page
    const pageSize = deploymentsResponse?.pageSize
    const totalPages = deploymentsResponse?.totalPages
    const deployableServices = await fetchDeployableServices()

    const entityRows = compose(
      deploymentEntityRows,
      decorateDeployments(deployableServices)
    )(deployments)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      caption: 'Microservice deployment details.',
      serviceFilters,
      userFilters,
      statusFilters,
      entityRows,
      environment,
      hiddenInputs: { page, size: pageSize },
      pagination: buildPagination(page, pageSize, totalPages, request.query),
      noResult: `Nothing has matched what you are looking for in ${capitalize(
        environment
      )}`
    })
  }
}

export { deploymentsListController }

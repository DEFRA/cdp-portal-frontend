import Joi from 'joi'
import Boom from '@hapi/boom'
import capitalize from 'lodash/capitalize.js'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'
import compose from 'lodash/fp/compose.js'
import { buildPagination } from '~/src/server/common/helpers/build-pagination.js'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { provideFormValues } from '~/src/server/deployments/helpers/ext/provide-form-values.js'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services.js'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { deploymentEntityRows } from '~/src/server/deployments/transformers/deployment-entity-rows.js'
import { fetchDeployments } from '~/src/server/deployments/helpers/fetch/fetch-deployments.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { fetchFilters } from '~/src/server/deployments/helpers/fetch/fetch-filters.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'

async function getFilters() {
  const filtersResponse = await fetchFilters()
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

  return {
    serviceFilters,
    userFilters,
    statusFilters
  }
}

const deploymentsListController = {
  options: {
    ext: {
      onPreAuth: [allEnvironmentsOnlyForAdmin],
      onPostHandler: [provideFormValues]
    },
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...getAllEnvironmentKebabNames())
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
    const formattedEnvironment = upperFirst(kebabCase(environment))

    const { serviceFilters, userFilters, statusFilters } = await getFilters()

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
      pageTitle: `${formattedEnvironment} deployments`,
      heading: `${formattedEnvironment} deployments`,
      caption: `${formattedEnvironment} microservice deployment details.`,
      serviceFilters,
      userFilters,
      statusFilters,
      entityRows,
      environment,
      hiddenInputs: { page, size: pageSize },
      pagination: buildPagination(page, pageSize, totalPages, request.query),
      noResult: `Nothing has matched what you are looking for in ${capitalize(
        environment
      )}`,
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `/deployments?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { deploymentsListController }

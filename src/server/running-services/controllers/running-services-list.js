import Joi from 'joi'
import Boom from '@hapi/boom'
import upperFirst from 'lodash/upperFirst.js'

import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { transformRunningServices } from '~/src/server/running-services/helpers/transformers/running-services.js'
import { fetchDeployableServices } from '~/src/server/common/helpers/fetch/fetch-deployable-services.js'
import { fetchRunningServicesFilters } from '~/src/server/running-services/helpers/fetch/fetch-running-services-filters.js'

async function getFilters() {
  const filtersResponse = await fetchRunningServicesFilters()
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

  const order = ['running', 'pending', 'undeployed']
  const statusFilters = buildSuggestions(
    filtersResponse.filters.statuses
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((status) => ({
        text: upperFirst(status),
        value: status
      }))
  )

  const teamFilters = buildSuggestions(
    filtersResponse.filters.teams.map((team) => ({
      text: team.name,
      value: team.teamId
    }))
  )

  return {
    serviceFilters,
    userFilters,
    statusFilters,
    teamFilters
  }
}

const runningServicesListController = {
  options: {
    id: 'running-services',
    validate: {
      query: Joi.object({
        service: Joi.string().allow(''),
        user: Joi.string().allow(''),
        status: Joi.string().allow(''),
        team: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const deployableServices = await fetchDeployableServices()
    const { serviceFilters, userFilters, statusFilters, teamFilters } =
      await getFilters()

    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const runningServices = await transformRunningServices(
      request,
      environments,
      deployableServices
    )

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      runningServices,
      environments,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters
    })
  }
}

export { runningServicesListController }

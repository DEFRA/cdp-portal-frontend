import Joi from 'joi'
import Boom from '@hapi/boom'
import capitalize from 'lodash/capitalize.js'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { buildPagination } from '~/src/server/common/helpers/build-pagination.js'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/common/helpers/ext/all-environments-only-for-admin.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { provideFormValues } from '~/src/server/deployments/helpers/ext/provide-form-values.js'
import { fetchDeployableServices } from '~/src/server/common/helpers/fetch/fetch-deployable-services.js'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { fetchDeploymentFilters } from '~/src/server/deployments/helpers/fetch/fetch-deployment-filters.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { deploymentToEntityRow } from '~/src/server/deployments/transformers/deployment-to-entity-row.js'
import { fetchDeploymentsWithMigrations } from '~/src/server/deployments/helpers/fetch/fetch-deployments-with-migrations.js'
import { migrationToEntityRow } from '~/src/server/deployments/transformers/migration-to-entity-row.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

async function getFilters() {
  const response = await fetchDeploymentFilters()
  const {
    filters: { services, users, statuses, teams, kinds }
  } = response

  const serviceFilters = buildSuggestions(
    services.map((serviceName) => ({ text: serviceName, value: serviceName }))
  )
  const userFilters = buildSuggestions(
    users.map((user) => ({ text: user.displayName, value: user.id }))
  )
  const statusFilters = buildSuggestions(
    statuses.map((status) => ({
      text: upperFirst(status.toLowerCase()),
      value: status
    }))
  )
  const teamFilters = buildSuggestions(
    teams.map((team) => ({ text: team.name, value: team.teamId }))
  )

  const kindFilters = buildSuggestions(
    kinds.map((kind) => ({ text: formatText(kind), value: kind }))
  )

  return {
    serviceFilters,
    userFilters,
    statusFilters,
    teamFilters,
    kindFilters
  }
}

const deploymentsListController = {
  options: {
    id: 'deployments/{environment}',
    pre: [provideAuthedUser],
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
        team: Joi.string().allow(''),
        kind: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const environment = request.params?.environment
    const formattedEnvironment = upperFirst(kebabCase(environment))

    const {
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      kindFilters
    } = await getFilters()

    const deploymentsResponse = await fetchDeploymentsWithMigrations(
      environment,
      {
        favouriteTeamIds: userScopeUUIDs,
        page: request.query?.page,
        size: request.query?.size,
        service: request.query.service,
        user: request.query.user,
        status: request.query.status,
        team: request.query.team,
        kind: request.query.kind
      }
    )
    const deployments = deploymentsResponse?.data
    const page = deploymentsResponse?.page
    const pageSize = deploymentsResponse?.pageSize
    const totalPages = deploymentsResponse?.totalPages
    const deployableServices = await fetchDeployableServices()

    const deploymentsDecorator = decorateDeployments({
      deployableServices,
      userScopeUUIDs
    })
    const deploymentsWithTeams = deploymentsDecorator(deployments)
    const rowBuilder = (entity) => {
      const rowBuilderMap = {
        deployment: deploymentToEntityRow(isAuthenticated),
        migration: migrationToEntityRow(isAuthenticated)
      }

      return rowBuilderMap[entity.kind](entity)
    }
    const rows = deploymentsWithTeams?.map(rowBuilder) ?? []

    return h.view('deployments/views/list', {
      pageTitle: `${formattedEnvironment} deployments`,
      heading: 'Deployments and Updates',
      caption: `${formattedEnvironment} microservice deployments and database updates`,
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      kindFilters,
      environment,
      hiddenInputs: { page, size: pageSize },
      tableData: {
        head: { isInverse: true },
        headers: [
          ...(isAuthenticated
            ? [{ id: 'owner', classes: 'app-entity-table__cell--owned' }]
            : []),
          { id: 'description', text: 'Description', width: '20' },
          { id: 'version', text: 'Version', width: '10' },
          { id: 'status', text: 'Status', width: '10' },
          { id: 'kind', text: 'Kind', width: '10' },
          { id: 'by', text: 'By', width: '20' },
          { id: 'team', text: 'Team', width: '15' },
          { id: 'started', text: 'Started', width: '20' }
        ],
        rows,
        noResult: `Nothing has matched what you are looking for in ${capitalize(
          environment
        )}`,
        pagination: buildPagination(page, pageSize, totalPages, request.query)
      },
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

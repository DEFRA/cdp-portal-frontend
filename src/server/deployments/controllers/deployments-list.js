import Joi from 'joi'
import Boom from '@hapi/boom'
import capitalize from 'lodash/capitalize.js'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { buildPagination } from '../../common/helpers/build-pagination.js'
import { allEnvironmentsOnlyForAdmin } from '../../common/helpers/ext/all-environments-only-for-admin.js'
import { buildSuggestions } from '../../common/components/autocomplete/helpers/build-suggestions.js'
import { provideFormValues } from '../helpers/ext/provide-form-values.js'
import { decorateRollouts } from '../transformers/decorate-rollouts.js'
import { pagination } from '../../common/constants/pagination.js'
import { fetchDeploymentFilters } from '../helpers/fetch/fetch-deployment-filters.js'
import { deploymentToEntityRow } from '../transformers/deployment-to-entity-row.js'
import { fetchDeploymentsWithMigrations } from '../helpers/fetch/fetch-deployments-with-migrations.js'
import { migrationToEntityRow } from '../transformers/migration-to-entity-row.js'
import {
  environmentValidation,
  repositoryNameValidation,
  teamIdValidation,
  userIdValidation
} from '@defra/cdp-validation-kit'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { performance } from 'perf_hooks'

const perf = {}

function start(request, name) {
  request.logger?.info(`-------------- ${name} start`)
  perf[name] = {}
  perf[name].start = performance.now()
}

function end(request, name) {
  perf[name].end = performance.now()
  request.logger?.info(`${name} took ${perf[name].end - perf[name].start}ms`)
  request.logger?.info(`-------------- ${name} end`)
}

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

  const uiTextDisplayMap = {
    deployment: 'Deployment',
    migration: 'Update'
  }

  const kindFilters = buildSuggestions(
    kinds.map((kind) => ({ text: uiTextDisplayMap[kind], value: kind }))
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
    ext: {
      onPreAuth: [allEnvironmentsOnlyForAdmin],
      onPostHandler: [provideFormValues]
    },
    validate: {
      params: Joi.object({
        environment: environmentValidation
      }),
      query: Joi.object({
        service: repositoryNameValidation.allow('').optional(),
        user: userIdValidation.allow('').optional(),
        status: Joi.string().allow(''),
        team: teamIdValidation.allow('').optional(),
        kind: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    start(request, 'one')
    const userSession = request.auth.credentials
    const userScopes = userSession?.scope ?? []
    end(request, 'one')

    start(request, 'two')
    const environment = request.params?.environment
    const formattedEnvironment = upperFirst(kebabCase(environment))
    end(request, 'two')

    start(request, 'three')
    const {
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      kindFilters
    } = await getFilters()
    end(request, 'three')

    start(request, 'four')
    const deploymentsResponse = await fetchDeploymentsWithMigrations(
      environment,
      {
        favourites: userScopes,
        page: request.query?.page,
        size: request.query?.size,
        service: request.query.service,
        user: request.query.user,
        status: request.query.status,
        team: request.query.team,
        kind: request.query.kind
      }
    )
    end(request, 'four')

    start(request, 'five')
    const deployments = deploymentsResponse?.data
    const page = deploymentsResponse?.page
    const pageSize = deploymentsResponse?.pageSize
    const totalPages = deploymentsResponse?.totalPages
    const deployableServices = await fetchServices()
    end(request, 'five')

    start(request, 'six')
    const deploymentsDecorator = decorateRollouts({
      deployableServices,
      userScopes
    })
    const deploymentsWithTeams = deploymentsDecorator(deployments)
    end(request, 'six')

    start(request, 'seven')
    const rowBuilder = (entity) => {
      const rowBuilderMap = {
        deployment: deploymentToEntityRow,
        migration: migrationToEntityRow
      }

      return rowBuilderMap[entity.kind](entity)
    }
    end(request, 'seven')

    start(request, 'eight')
    const rows = deploymentsWithTeams?.map(rowBuilder) ?? []
    end(request, 'eight')

    start(request, 'nine')

    start(request, 'one')

    const view = h.view('deployments/views/list', {
      pageTitle: `${formattedEnvironment} microservice deployments and database updates`,
      pageHeading: {
        caption: formattedEnvironment,
        text: 'Deployments and updates',
        intro: `${formattedEnvironment} microservice deployments and database updates`
      },
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
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          {
            id: 'description',
            text: 'Description',
            width: '20',
            isLeftAligned: true
          },
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
        pagination: buildPagination(page, pageSize, totalPages, request.query),
        isWide: true
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

    end(request, 'nine')

    return view
  }
}

export { deploymentsListController }

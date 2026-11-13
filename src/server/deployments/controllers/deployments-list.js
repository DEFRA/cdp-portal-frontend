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
import { fetchDeploymentFilters } from '../helpers/fetch/fetch-deployment-filters.js'
import { deploymentToEntityRow } from '../transformers/deployment-to-entity-row.js'
import { fetchDeploymentsWithMigrations } from '../helpers/fetch/fetch-deployments-with-migrations.js'
import { migrationToEntityRow } from '../transformers/migration-to-entity-row.js'
import {
  environmentValidation,
  userIdValidation
} from '@defra/cdp-validation-kit'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { changeRequestEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { getUserTeamsUnexpanded } from '#server/common/helpers/user/get-users-teams.js'
import { stringify } from 'qs'

export const deploymentsListController = {
  options: {
    id: 'deployments/{environment}',
    ext: {
      onPostAuth: [allEnvironmentsOnlyForAdmin],
      onPostHandler: [provideFormValues]
    },
    validate: {
      params: Joi.object({
        environment: environmentValidation
      }),
      query: Joi.object({
        service: Joi.string().allow(''),
        user: userIdValidation.allow('').optional(),
        status: Joi.string().allow(''),
        team: Joi.array().items(Joi.string()).single(),
        kind: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const userScopes = userSession?.scope ?? []

    const environment = request.params?.environment
    const formattedEnvironment = upperFirst(kebabCase(environment))

    const {
      serviceFilters,
      userFilters,
      statusFilters,
      teamFilters,
      kindFilters
    } = await getFilters()

    const userTeams = getUserTeamsUnexpanded(request)
    const queryTeams = request.query.team ?? []

    const queryMatchesUserTeams = sameTeams(userTeams, queryTeams)

    let teamValue

    if (queryTeams.length > 1) {
      teamValue = queryMatchesUserTeams ? 'my-teams' : 'selected-teams'

      if (!queryMatchesUserTeams) {
        teamFilters.splice(1, 0, {
          value: 'selected-teams',
          text: 'Selected Teams',
          queryParams: {
            team: queryTeams
          }
        })
      }
    } else {
      teamValue = queryTeams[0]
    }

    if (userTeams.length > 1) {
      teamFilters.splice(1, 0, {
        value: 'my-teams',
        text: 'My Teams',
        queryParams: {
          team: userTeams
        }
      })
    }

    const deploymentsResponse = await fetchDeploymentsWithMigrations(
      environment,
      {
        favourites: userScopes,
        page: request.query?.page,
        size: request.query?.size,
        service: request.query.service,
        user: request.query.user,
        status: request.query.status,
        teamId: request.query.team,
        kind: request.query.kind
      }
    )
    const deployments = deploymentsResponse?.data
    const page = deploymentsResponse?.page
    const pageSize = deploymentsResponse?.pageSize
    const totalPages = deploymentsResponse?.totalPages
    const deployableServices = await fetchServices()

    const deploymentsDecorator = decorateRollouts({
      deployableServices,
      userScopes
    })
    const deploymentsWithTeams = deploymentsDecorator(deployments)
    const rowBuilder = (entity) => {
      const rowBuilderMap = {
        deployment: deploymentToEntityRow,
        migration: migrationToEntityRow
      }

      return rowBuilderMap[entity.kind](entity)
    }
    const showChangeRecords = changeRequestEnvironments.includes(environment)
    const rows =
      deploymentsWithTeams
        ?.map(rowBuilder)
        .map((row) => ({ ...row, showChangeRecords })) ?? []

    return h.view('deployments/views/list', {
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
      teamValue,
      kindFilters,
      showChangeRecords,
      environment,
      hiddenInputs: { page, size: pageSize },
      tableData: {
        rows,
        noResult: `Nothing has matched what you are looking for in ${capitalize(
          environment
        )}`,
        pagination: buildPagination(page, pageSize, totalPages, request.query),
        isInverse: true,
        isWide: true
      },
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `/deployments?${stringify({ ...request.query, page: 1 }, { arrayFormat: 'repeat' })}`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

function sameTeams(a, b) {
  const setA = new Set(a)
  const setB = new Set(b)

  return setA.size === setB.size && [...setA].every((team) => setB.has(team))
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

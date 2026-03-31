import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { scopes } from '@defra/cdp-validation-kit'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getDependencyDependents } from '../DependencyService.js'
import { fetchCdpTeams } from '#server/teams/helpers/fetch/fetch-cdp-teams.js'
import { getEntityTags } from '../FilterService.js'
import { fetchEntities } from '#server/common/helpers/fetch/fetch-entities.js'
import { buildPagination } from '#server/common/helpers/build-pagination.js'
import { pagination } from '#server/common/constants/pagination.js'
import Joi from 'joi'

export const options = {
  id: 'dependency-explorer',
  // TODO: Remove
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin
    }
  },
  validate: {
    query: Joi.object({
      page: Joi.number(),
      size: Joi.number()
    }).unknown()
  }
}

export default async function (request) {
  const [dependencyType, dependencyName] =
    request.params?.dependency?.split(':') ?? []
  const userSession = request.auth.credentials
  const environments = getEnvironments(userSession?.scope)
  const page = request.query?.page ?? pagination.page
  const size = request.query?.size ?? pagination.size

  const environmentOptions = buildOptions(
    environments.map((environment) => ({
      text: formatText(environment),
      value: environment
    }))
  )

  const [teams, entityTags, entities] = await Promise.all([
    fetchCdpTeams(),
    getEntityTags(),
    fetchEntities()
  ])

  const teamOptions = buildOptions(
    teams.map((team) => ({
      value: team.teamId,
      text: team.name
    }))
  )
  const tagOptions = buildOptions(entityTags)
  const entityOptions = buildOptions(
    entities.map((entity) => ({
      value: entity.name,
      text: entity.name
    }))
  )

  let rows = []
  let totalItems = 0
  let totalPages = 1

  if (dependencyName && dependencyType) {
    const { results: dependents, meta } = await getDependencyDependents(
      dependencyType,
      dependencyName,
      request.query
    )

    totalItems = meta.total
    totalPages = meta.totalPages

    rows = dependents.map((dependent) => ({
      entity: dependent.name,
      entityVersion: dependent.version,
      entityTags: dependent.tags,
      entityStage: dependent.stage,
      teams: dependent.teams.map((team) => ({
        value: teams.find((entry) => entry.teamId === team)?.name,
        url: `/teams/${team}`
      })),
      dependencyVersion: dependent.depversion,
      envs: environments.map((env) => ({
        id: env.toLowerCase(),
        selected: dependent.environments?.includes(env)
      }))
    }))
  }

  const supportVerticalHeadings = environments.length >= 5

  return {
    pageTitle: 'Dependencies Explorer',
    pageUrl: request.routeLookup('dependency-explorer', {
      params: {
        dependency: encodeURIComponent(`${dependencyType}:${dependencyName}`)
      }
    }),
    query: request.query,
    dependencyType,
    dependencyName,
    environmentOptions,
    tagOptions,
    teamOptions,
    entityOptions,
    totalItems,
    tableData: {
      headers: [
        {
          id: 'entity',
          text: 'Service name',
          width: 15,
          isLeftAligned: true
        },
        { id: 'dependencyVersion', text: 'Dependency version', width: 10 },
        { id: 'teams', text: 'Team', width: 15 },
        ...environments.map((env) => ({
          ...(supportVerticalHeadings && { verticalText: true }),
          id: env.toLowerCase(),
          text: formatText(env),
          width: env.length
        }))
      ],
      rows,
      pagination: buildPagination(page, size, totalPages, request.query),
      noResult: 'No services found',
      isWide: false,
      isInverse: true
    }
  }
}

export async function POST(request, h) {
  const dependency = request.payload.dependency

  return h.redirect(
    request.routeLookup('dependency-explorer', {
      params: {
        dependency: encodeURIComponent(dependency)
      }
    })
  )
}

import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { scopes } from '@defra/cdp-validation-kit'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getDependencyDependents } from '../DependencyService.js'
import { fetchCdpTeams } from '#server/teams/helpers/fetch/fetch-cdp-teams.js'

export const options = {
  id: 'dependency-explorer',
  // TODO: Remove
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin
    }
  }
}

export default async function (request) {
  const [dependencyType, dependencyName] =
    request.params?.dependency?.split(':') ?? []
  const userSession = request.auth.credentials
  const environments = getEnvironments(userSession?.scope)

  const environmentOptions = buildOptions(
    environments.map((environment) => ({
      text: formatText(environment),
      value: environment
    }))
  )

  let rows = []

  if (dependencyName && dependencyType) {
    const [dependents, teams] = await Promise.all([
      getDependencyDependents(dependencyType, dependencyName, request.query),
      fetchCdpTeams()
    ])

    rows = dependents.map((dependent) => ({
      entity: dependent.name,
      entityVersion: dependent.version,
      entityTags: dependent.tags,
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
    dependencyType,
    dependencyName,
    environmentOptions,
    tableData: {
      headers: [
        {
          id: 'entity',
          text: 'Dependent Service',
          width: 15,
          isLeftAligned: true
        },
        { id: 'teams', text: 'Team', width: 15 },
        { id: 'dependencyVersion', text: 'Version', width: 10 },
        ...environments.map((env) => ({
          ...(supportVerticalHeadings && { verticalText: true }),
          id: env.toLowerCase(),
          text: formatText(env),
          width: env.length
        }))
      ],
      rows,
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
        dependency
      }
    })
  )
}

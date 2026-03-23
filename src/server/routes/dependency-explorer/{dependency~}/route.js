import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { scopes } from '@defra/cdp-validation-kit'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

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
  const userSession = request.auth.credentials
  const environments = getEnvironments(userSession?.scope)

  const environmentOptions = buildOptions(
    environments.map((environment) => ({
      text: formatText(environment),
      value: environment
    }))
  )

  const rows = [
    {
      entity: 'cdp-example-backend',
      entityVersion: '2.1.0',
      entityVersionTag: 'latest',
      teams: [{ value: 'Platform', url: '/' }],
      dependencyVersion: '2.4.5',
      envs: environments.map((env) => ({
        id: env.toLowerCase(),
        selected: ['dev'].includes(env)
      }))
    },
    {
      entity: 'cdp-example-frontend',
      entityVersion: '1.1.1',
      entityVersionTag: 'latest',
      teams: [{ value: 'Platform', url: '/' }],
      dependencyVersion: '2.4.5',
      envs: environments.map((env) => ({
        id: env.toLowerCase(),
        selected: [].includes(env)
      }))
    },
    {
      entity: 'cdp-example-backend',
      entityVersion: '2.0.7',
      entityVersionTag: '',
      teams: [{ value: 'Platform', url: '/' }],
      dependencyVersion: '2.4.5',
      envs: environments.map((env) => ({
        id: env.toLowerCase(),
        selected: ['prod', 'test'].includes(env)
      }))
    },
    {
      entity: 'cdp-example-frontend',
      entityVersion: '1.1.0',
      entityVersionTag: '',
      teams: [{ value: 'Platform', url: '/' }],
      dependencyVersion: '2.4.5',
      envs: environments.map((env) => ({
        id: env.toLowerCase(),
        selected: ['prod', 'test', 'dev'].includes(env)
      }))
    }
  ]

  const supportVerticalHeadings = environments.length >= 5

  return {
    pageTitle: 'Dependencies Explorer',
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

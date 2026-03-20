import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'

export default {
  options: {
    id: 'dependency-explorer'
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const environments = getEnvironments(userSession?.scope)

    const rows = [
      {
        entity: 'cdp-example-frontend',
        entityVersion: '1.1.1',
        entityVersionTag: 'latest',
        teams: [{ value: 'Platform', url: '/' }],
        dependencyVersion: '0.4.5',
        envs: environments.map((env) => ({
          id: env.toLowerCase(),
          selected: [].includes(env)
        }))
      },
      {
        entity: 'cdp-example-frontend',
        entityVersion: '1.1.0',
        entityVersionTag: '',
        teams: [{ value: 'Platform', url: '/' }],
        dependencyVersion: '0.4.5',
        envs: environments.map((env) => ({
          id: env.toLowerCase(),
          selected: ['prod', 'test', 'dev'].includes(env)
        }))
      },
      {
        entity: 'cdp-example-backend',
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        teams: [{ value: 'Platform', url: '/' }],
        dependencyVersion: '0.4.5',
        envs: environments.map((env) => ({
          id: env.toLowerCase(),
          selected: ['dev'].includes(env)
        }))
      },
      {
        entity: 'cdp-example-backend',
        entityVersion: '2.0.7',
        entityVersionTag: '',
        teams: [{ value: 'Platform', url: '/' }],
        dependencyVersion: '0.4.5',
        envs: environments.map((env) => ({
          id: env.toLowerCase(),
          selected: ['prod', 'test'].includes(env)
        }))
      }
    ]

    const supportVerticalHeadings = environments.length >= 5

    return h.view('dependency-explorer/views/entities-list', {
      pageTitle: 'Dependencies Explorer',

      tableData: {
        headers: [
          {
            id: 'entity',
            text: 'Consuming Service',
            width: '15',
            isLeftAligned: true
          },
          { id: 'teams', text: 'Team', width: '15' },
          { id: 'dependencyVersion', text: 'Version', width: '10' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          }))
        ],
        rows,
        noResult: 'No dependencies found',
        isWide: false,
        isInverse: true
      }
    })
  }
}

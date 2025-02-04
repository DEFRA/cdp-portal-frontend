import { dollarFormatter } from '~/src/server/common/helpers/currency/formatter.js'

function costToEntityRow(cost) {
  const serviceTeams = cost.teams
    .filter((team) => team.teamId)
    .map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return {
    cells: [
      {
        headers: 'service-code',
        entity: {
          kind: 'link',
          value: cost.name ? cost.name : null,
          url: `/admin/costs/${cost.name.toLowerCase()}`
        }
      },
      {
        headers: 'team',
        entity: { kind: 'group', value: serviceTeams }
      },
      {
        headers: 'all-environments',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.allEnvironmentsTotal)
        }
      },
      {
        headers: 'infra-dev',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.infraDev)
        }
      },
      {
        headers: 'management',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.management)
        }
      },
      {
        headers: 'dev',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.dev)
        }
      },
      {
        headers: 'test',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.test)
        }
      },
      {
        headers: 'ext-test',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.extTest)
        }
      },
      {
        headers: 'perfTest',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.perfTest)
        }
      },
      {
        headers: 'prod',
        entity: {
          kind: 'html',
          value: dollarFormatter(cost.environments.prod)
        }
      }
    ]
  }
}

export { costToEntityRow }

import {
  renderComponent,
  renderIcon
} from '../../../common/helpers/nunjucks/render-component.js'
import { performance } from 'perf_hooks'

const perf = {}

function start(request, name) {
  request?.logger?.info(
    `-------------- runningServiceToEntityRow: ${name} start`
  )
  perf[name] = {}
  perf[name].start = performance.now()
}

function end(request, name) {
  perf[name].end = performance.now()
  request?.logger?.info(
    `runningServiceToEntityRow: ${name} took ${perf[name].end - perf[name].start}ms`
  )
  request.logger?.info(`-------------- runningServiceToEntityRow: ${name} end`)
}

function runningServiceToEntityRow(allEnvironments, request) {
  return ({ serviceName, environments, teams, isOwner }) => {
    start(request, 'one')
    const serviceTeams = teams
      .filter((team) => team.teamId)
      .map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))
    end(request, 'one')

    start(request, 'two')

    const icon = isOwner
      ? renderComponent(
          'tool-tip',
          {
            text: 'Owned Service',
            classes: 'app-tool-tip--small'
          },
          [renderIcon('star-icon', { classes: 'app-icon--minuscule' })]
        )
      : ''

    end(request, 'two')

    const runningServiceEnvironments = Object.values(environments)

    start(request, 'five')
    const envs = allEnvironments.map((environmentName) => {
      start(request, 'three')
      const rsEnvDetail = runningServiceEnvironments.find(
        (env) => env.environment === environmentName
      )

      end(request, 'three')

      start(request, 'four')
      if (rsEnvDetail) {
        return {
          headers: environmentName,
          isSlim: true,
          entity: {
            kind: 'html',
            value: renderComponent('running-service-entity', rsEnvDetail)
          }
        }
      }
      end(request, 'four')

      return {
        headers: environmentName,
        isSlim: true,
        html: '<div class="app-running-service-entity--empty"></div>'
      }
    })

    end(request, 'five')

    return {
      cells: [
        {
          headers: 'owner',
          isCentered: true,
          classes: 'app-entity-table__cell--owned',
          entity: { kind: 'html', value: icon }
        },
        {
          headers: 'service',
          entity: {
            kind: 'link',
            value: serviceName,
            url: `/running-services/${serviceName}`
          }
        },
        {
          headers: 'team',
          entity: { kind: 'group', value: serviceTeams }
        },
        ...envs
      ]
    }
  }
}

export { runningServiceToEntityRow }

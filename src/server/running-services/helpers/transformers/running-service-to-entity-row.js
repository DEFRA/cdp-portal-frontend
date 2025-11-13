import {
  renderCachedComponent,
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
  return ({
    serviceName,
    environments: serviceEnvironments,
    teams,
    isOwner
  }) => {
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

    const serviceEnvironmentsDetailMap = new Map(
      Object.values(serviceEnvironments).map((env) => [env.environment, env])
    )

    start(request, 'six')
    const envs = allEnvironments.map((environmentName, i) => {
      start(request, `three-${i}`)

      const serviceEnvironmentDetail =
        serviceEnvironmentsDetailMap.get(environmentName)

      end(request, `three-${i}`)

      if (serviceEnvironmentDetail) {
        start(request, `four-${i}`)
        const returnValue = {
          headers: environmentName,
          isSlim: true,
          entity: {
            kind: 'html',
            value: renderCachedComponent(
              'running-service-entity',
              serviceEnvironmentDetail
            )
          }
        }
        end(request, `four-${i}`)

        return returnValue
      }

      start(request, `five-${i}`)
      const otherReturnValue = {
        headers: environmentName,
        isSlim: true,
        html: '<div class="app-running-service-entity--empty"></div>'
      }
      end(request, `five-${i}`)

      return otherReturnValue
    })

    end(request, 'six')

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

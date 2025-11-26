import {
  renderComponent,
  renderIcon
} from '../../../common/helpers/nunjucks/render-component.js'

function runningServiceToEntityRow(allEnvironments) {
  return ({
    serviceName,
    environments: serviceEnvironments,
    teams,
    isOwner
  }) => {
    const serviceTeams = teams
      .filter((team) => team.teamId)
      .map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))

    const icon = isOwner
      ? renderIcon('star-icon', { classes: 'app-icon--minuscule' })
      : ''

    const serviceEnvironmentsDetailMap = new Map(
      Object.values(serviceEnvironments).map((env) => [env.environment, env])
    )

    const envs = allEnvironments.map((environmentName) => {
      const serviceEnvironmentDetail =
        serviceEnvironmentsDetailMap.get(environmentName)

      if (serviceEnvironmentDetail) {
        return {
          headers: environmentName,
          isSlim: true,
          entity: {
            kind: 'html',
            value: renderComponent(
              'running-service-entity',
              serviceEnvironmentDetail
            )
          }
        }
      }

      return {
        headers: environmentName,
        isSlim: true,
        html: '<div class="app-running-service-entity--empty"></div>'
      }
    })

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

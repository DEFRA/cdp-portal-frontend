import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function runningServiceToEntityRow(allEnvironments, isAuthenticated) {
  return ({ serviceName, environments, teams, isOwner }) => {
    const serviceTeams = teams
      .filter((team) => team.teamId)
      .map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))

    const icon = isOwner
      ? renderComponent(
          'tool-tip',
          {
            text: 'Owned Service',
            classes: 'app-tool-tip--small'
          },
          [renderIcon('star-icon', { classes: 'app-icon--tiny' })]
        )
      : ''

    const runningServiceEnvironments = Object.values(environments)

    const envs = allEnvironments.map((environmentName) => {
      const rsEnvDetail = runningServiceEnvironments.find(
        (env) => env.environment === environmentName
      )

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

      return {
        headers: environmentName,
        isSlim: true,
        html: '<div class="app-running-service-entity--empty"></div>'
      }
    })

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                isCentered: true,
                classes: 'app-entity-table__cell--owned',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
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

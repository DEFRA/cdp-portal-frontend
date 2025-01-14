import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function runningServiceToEntityRow(allEnvironments, isAuthenticated) {
  return ({ serviceName, environments, teams, userOwnsService }) => {
    const serviceTeams = teams
      .filter((team) => team.teamId)
      .map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))

    const icon = userOwnsService
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
        headers: environmentName
      }
    })

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
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

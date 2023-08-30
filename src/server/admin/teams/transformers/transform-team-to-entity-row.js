import { appConfig } from '~/src/config'

function transformTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `${appConfig.get('appPathPrefix')}/admin/teams/${team.teamId}`
    },
    {
      kind: 'text',
      value: team.description
    },
    {
      kind: 'text',
      value: team.users.length
    }
  ]
}

export { transformTeamToEntityRow }

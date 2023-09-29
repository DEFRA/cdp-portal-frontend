import { config } from '~/src/config'

function transformCdpTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `${config.get('appPathPrefix')}/admin/teams/${team.teamId}`
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

export { transformCdpTeamToEntityRow }

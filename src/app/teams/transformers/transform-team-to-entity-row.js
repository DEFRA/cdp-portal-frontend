import { appConfig } from '~/src/config'

function transformTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `${appConfig.get('appPathPrefix')}/teams/${team.id}`
    },
    {
      kind: 'text',
      value: team.members?.length,
      size: 'small'
    },
    {
      kind: 'date',
      value: team.createdAt,
      size: 'large'
    }
  ]
}

export { transformTeamToEntityRow }

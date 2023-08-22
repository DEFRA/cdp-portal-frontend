import { appConfig } from '~/src/config'

function transformTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `${appConfig.get('appPathPrefix')}/teams/${team.id}`
    },
    {
      kind: 'link',
      value: `@${team.id}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/teams/${team.id}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: team.members?.length
    },
    {
      kind: 'date',
      value: team.createdAt
    }
  ]
}

export { transformTeamToEntityRow }

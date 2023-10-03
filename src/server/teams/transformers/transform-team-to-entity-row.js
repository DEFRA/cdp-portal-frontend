import { config } from '~/src/config'

function transformTeamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: team.name,
      url: `${config.get('appPathPrefix')}/teams/${team.id}`
    },
    {
      kind: 'link',
      value: `@${team.id}`,
      url: `https://github.com/orgs/${githubOrg}/teams/${team.id}`,
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

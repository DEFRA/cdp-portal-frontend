import { config } from '~/src/config'

function transformCdpTeamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

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
      kind: 'link',
      value: team.github ? `@${team.github}` : null,
      url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: team.users.length
    }
  ]
}

export { transformCdpTeamToEntityRow }

import { config } from '~/src/config/index.js'

function transformTeamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: team.name,
      url: `/admin/teams/${team.teamId}`
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
      value: team.serviceCodes
    },
    {
      kind: 'html',
      value: team.alertEmailAddresses?.join('<br>')
    },
    {
      kind: 'text',
      value: team.users.length
    }
  ]
}

export { transformTeamToEntityRow }

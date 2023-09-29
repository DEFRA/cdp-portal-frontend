import { config } from '~/src/config'

function transformTeamToHeadingEntities(team) {
  const gitHubOrg = config.get('gitHubOrg')

  return [
    {
      kind: 'link',
      value: `@${team.id}`,
      url: `https://github.com/orgs/${gitHubOrg}/teams/${team.id}`,
      newWindow: true,
      label: 'GitHub'
    },
    {
      kind: 'date',
      value: team.createdAt,
      label: 'Created'
    }
  ]
}

export { transformTeamToHeadingEntities }

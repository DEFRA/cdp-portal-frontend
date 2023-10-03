import { config } from '~/src/config'

function transformTeamToHeadingEntities(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: `@${team.id}`,
      url: `https://github.com/orgs/${githubOrg}/teams/${team.id}`,
      newWindow: true,
      label: 'Github'
    },
    {
      kind: 'date',
      value: team.createdAt,
      label: 'Created'
    }
  ]
}

export { transformTeamToHeadingEntities }

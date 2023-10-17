import { config } from '~/src/config'

function transformTeamToHeadingEntities(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: team.github ? `@${team.github}` : null,
      url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
      newWindow: true,
      label: 'Github team'
    },
    {
      kind: 'date',
      value: team.updatedAt,
      label: 'Last updated'
    }
  ]
}

export { transformTeamToHeadingEntities }

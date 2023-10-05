import { config } from '~/src/config'

function transformTeamToHeadingEntities(team) {
  const githubOrg = config.get('githubOrg')

  return [
    ...(team.github
      ? [
          {
            kind: 'link',
            value: `@${team.github}`,
            url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
            newWindow: true,
            label: 'Github'
          }
        ]
      : []),
    {
      kind: 'date',
      value: team.updatedAt,
      label: 'Last updated'
    },
    {
      kind: 'date',
      value: team.createdAt,
      label: 'Created'
    }
  ]
}

export { transformTeamToHeadingEntities }

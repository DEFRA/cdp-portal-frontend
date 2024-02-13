import { config } from '~/src/config'

function teamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    },
    {
      kind: 'link',
      value: team?.github ? `@${team.github}` : null,
      url: team?.github
        ? `https://github.com/orgs/${githubOrg}/teams/${team.github}`
        : null,
      newWindow: true
    },
    {
      kind: 'text',
      value: team.users?.length
    },
    {
      kind: 'date',
      value: team.updatedAt
    },
    {
      kind: 'date',
      value: team.createdAt
    }
  ]
}

export { teamToEntityRow }

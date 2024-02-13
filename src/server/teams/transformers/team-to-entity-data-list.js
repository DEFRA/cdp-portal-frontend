import { config } from '~/src/config'

function teamToEntityDataList(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      heading: 'Github team',
      entity: {
        kind: 'link',
        value: team.github ? `@${team.github}` : null,
        url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
        newWindow: true
      }
    },
    {
      heading: 'Members',
      entity: {
        kind: 'text',
        value: team.users?.length
      }
    },
    {
      heading: 'Last updated',
      entity: {
        kind: 'date',
        value: team.updatedAt
      }
    },
    {
      heading: 'Created',
      entity: {
        kind: 'date',
        value: team.createdAt
      }
    }
  ]
}

export { teamToEntityDataList }

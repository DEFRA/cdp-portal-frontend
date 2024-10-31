import { config } from '~/src/config/index.js'

function teamToEntityDataList(team) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      heading: {
        text: 'GitHub team'
      },
      entity: {
        kind: 'link',
        value: team.github ? `@${team.github}` : null,
        url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
        newWindow: true
      }
    },
    {
      heading: {
        text: 'Members'
      },
      entity: {
        kind: 'text',
        value: team.users?.length
      }
    },
    {
      heading: {
        text: 'Last updated'
      },
      entity: {
        kind: 'date',
        value: team.updatedAt
      }
    },
    {
      heading: {
        text: 'Created'
      },
      entity: {
        kind: 'date',
        value: team.createdAt
      }
    }
  ]
}

export { teamToEntityDataList }

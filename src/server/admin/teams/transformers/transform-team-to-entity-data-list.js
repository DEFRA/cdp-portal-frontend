import { config } from '~/src/config/index.js'

function transformTeamToEntityDataList(team) {
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
        text: 'Service Codes'
      },
      entity: {
        kind: 'text',
        value: team.serviceCodes
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

export { transformTeamToEntityDataList }

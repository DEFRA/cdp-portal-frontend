import { config } from '~/src/config'

function transformCdpTeamToEntityDataList(team) {
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
      heading: 'Created',
      entity: {
        kind: 'date',
        value: team.createdAt
      }
    }
  ]
}

export { transformCdpTeamToEntityDataList }

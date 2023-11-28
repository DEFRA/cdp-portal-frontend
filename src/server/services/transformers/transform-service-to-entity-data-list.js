import { config } from '~/src/config'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function transformServiceToEntityDataList(service) {
  const dockerHubUrl = config.get('dockerHubUrl')
  const dockerHubServicePage = dockerHubUrl + '/' + service?.imageName + '/tags'

  return [
    {
      heading: 'Github Repository',
      entity: {
        kind: 'link',
        value: removeUrlParts(service.githubUrl),
        url: service.githubUrl,
        newWindow: true
      }
    },
    {
      heading: `Team${service?.teams.length > 1 ? 's' : ''}`,
      entity: {
        kind: 'list',
        value: service?.teams?.map((team) => ({
          kind: 'link',
          value: team.name,
          url: `/teams/${team.teamId}`
        }))
      }
    },
    ...(service?.primaryLanguage
      ? [
          {
            heading: 'Type',
            entity: {
              kind: 'text',
              value: service.primaryLanguage
            }
          }
        ]
      : []),
    ...(service?.imageName
      ? [
          {
            heading: 'Docker Hub',
            entity: {
              kind: 'link',
              value: removeUrlParts(dockerHubServicePage, 4),
              url: dockerHubServicePage,
              newWindow: true
            }
          }
        ]
      : []),
    {
      heading: 'Repository Created',
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { transformServiceToEntityDataList }

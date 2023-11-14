import { config } from '~/src/config'
import { removeHost } from '~/src/server/common/helpers/remove-host'

function transformServiceToEntityDataList(service) {
  return [
    {
      heading: `Team${service?.teams.length > 1 ? 's' : ''}`,
      entity: {
        kind: 'list',
        value: service?.teams?.map((team) => ({
          kind: 'link',
          value: team.name,
          url: config.get('appPathPrefix') + `/teams/${team.teamId}`
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
    {
      heading: 'Github Repository',
      entity: {
        kind: 'link',
        value: removeHost(service.githubUrl),
        url: service.githubUrl,
        newWindow: true
      }
    },
    ...(service?.imageName
      ? [
          {
            heading: 'ECR Docker Image name',
            entity: {
              kind: 'text',
              value: service?.imageName
            }
          }
        ]
      : []),
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { transformServiceToEntityDataList }

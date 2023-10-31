import { config } from '~/src/config'
import { removeHost } from '~/src/server/common/helpers/remove-host'

function transformServiceToEntityDataList(service) {
  const team = service?.teams?.at(0)

  return [
    {
      heading: 'Team',
      entity: {
        kind: 'link',
        value: team,
        url: `${config.get('appPathPrefix')}/teams/${team}`
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

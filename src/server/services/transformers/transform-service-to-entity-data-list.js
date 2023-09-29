import { startCase } from 'lodash'

import { config } from '~/src/config'

function transformServiceToEntityDataList(service) {
  const team = service?.teams?.at(0)

  return [
    {
      heading: 'Team',
      entity: {
        kind: 'link',
        value: team && startCase(team),
        url: `${config.get('appPathPrefix')}/teams/${team}`
      }
    },
    {
      heading: 'Type',
      entity: {
        kind: 'text',
        value: service.primaryLanguage
      }
    },
    {
      heading: 'GitHub Repository',
      html:
        service.githubUrl &&
        `<a class="app-link" href="${service.githubUrl}" target="_blank">${service.githubUrl}</a>`
    },
    {
      heading: 'ECR Docker Image name',
      text: service?.imageName
    },
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { transformServiceToEntityDataList }

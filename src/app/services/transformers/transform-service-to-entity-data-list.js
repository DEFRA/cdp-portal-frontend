import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityDataList(service) {
  const team = service?.teams?.at(0)
  return [
    {
      heading: 'Team',
      entity: {
        kind: 'link',
        value: team,
        url: `${appConfig.get('appPathPrefix')}/teams/${team}`
      }
    },
    {
      heading: 'Type',
      entity: {
        kind: 'text',
        value: startCase(service.primaryLanguage.name).replace('#', ' Sharp')
      }
    },
    {
      heading: 'GitHub Repository',
      html: `<a class="app-link" href="${service.repositoryUrl}" target="_blank">defra-cdp-sandpit/${service.id}</a>`
    },
    {
      heading: 'ECR Docker Image name',
      text: service.id
    },
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { transformServiceToEntityDataList }

import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: service.metadata.imageName ?? service.id,
      url: `${appConfig.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'link',
      value: service.teams?.at(0)?.name,
      url: `${appConfig.get('appPathPrefix')}/teams/${
        service.teams?.at(0)?.slug
      }`
    },
    {
      kind: 'text',
      value: startCase(service.metadata.serviceType)
    },
    {
      kind: 'link',
      value: service.repositoryUrl.replace(/https:\/\/github\.com\//g, ''),
      url: service.repositoryUrl,
      newWindow: true
    },
    {
      kind: 'date',
      value: service.createdAt,
      size: 'large'
    }
  ]
}

export { transformServiceToEntityRow }

import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: startCase(service.id),
      url: `${appConfig.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'text',
      value: service.id
    },
    {
      kind: 'text',
      value: startCase(service.metadata.serviceType)
    },

    {
      kind: 'link',
      value: service.teams?.at(0)?.name,
      url: `${appConfig.get('appPathPrefix')}/teams/${
        service.teams?.at(0)?.slug
      }`
    },
    {
      kind: 'link',
      value: service.url && `https://snd.${service.id}.defra.gov.uk`,
      url: service.url,
      newWindow: true
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

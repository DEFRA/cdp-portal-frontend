import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: service.serviceName,
      url: `${appConfig.get('appPathPrefix')}/services/${service.serviceName}`
    },
    {
      kind: 'link',
      value: service.teams?.at(0) && startCase(service.teams.at(0)),
      url: `${appConfig.get('appPathPrefix')}/teams/${service.teams?.at(0)}`
    },
    {
      kind: 'text',
      value: service.primaryLanguage
    },
    {
      kind: 'link',
      value: `defra-cdp-sandpit/${service.id}`,
      url: `https://github.com/defra-cdp-sandpit/${service.id}`,
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

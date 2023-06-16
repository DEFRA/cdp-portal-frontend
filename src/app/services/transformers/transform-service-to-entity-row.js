import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: service.id,
      url: `${appConfig.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'link',
      value: service.teams?.at(0),
      url: `${appConfig.get('appPathPrefix')}/teams/${service.teams?.at(0)}`
    },
    {
      kind: 'text',
      value: startCase(service.primaryLanguage.replace('#', ' Sharp')) // nunjucks appears to supress #?
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

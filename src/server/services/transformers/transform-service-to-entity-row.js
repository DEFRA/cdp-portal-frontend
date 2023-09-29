import { startCase } from 'lodash'

import { config } from '~/src/config'

function transformServiceToEntityRow(service) {
  const gitHubOrg = config.get('gitHubOrg')

  return [
    {
      kind: 'link',
      value: service.serviceName,
      url: `${config.get('appPathPrefix')}/services/${service.serviceName}`
    },
    {
      kind: 'link',
      value: service.teams?.at(0) && startCase(service.teams.at(0)),
      url: `${config.get('appPathPrefix')}/teams/${service.teams?.at(0)}`
    },
    {
      kind: 'text',
      value: service.primaryLanguage
    },
    {
      kind: 'link',
      value: `${gitHubOrg}/${service.id}`,
      url: `https://github.com/${gitHubOrg}/${service.id}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: service.createdAt
    }
  ]
}

export { transformServiceToEntityRow }

import { startCase } from 'lodash'

import { config } from '~/src/config'

function transformServiceToEntityRow(service) {
  const githubOrg = config.get('githubOrg')

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
      value: `${githubOrg}/${service.id}`,
      url: `https://github.com/${githubOrg}/${service.id}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: service.createdAt
    }
  ]
}

export { transformServiceToEntityRow }

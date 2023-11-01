import { startCase } from 'lodash'

import { config } from '~/src/config'
import { statusTagClassMap } from '~/src/server/services/transformers/status-tag-class-map'

function transformServiceToEntityRow(service) {
  const githubOrg = config.get('githubOrg')
  const status = service?.serviceStatus?.status

  // For services that are being created show, in-progress or failure tag. For created services show created date
  const createdEntity = status
    ? {
        kind: 'tag',
        value: status,
        classes: statusTagClassMap(status)
      }
    : { kind: 'date', value: service.createdAt }

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
    createdEntity
  ]
}

export { transformServiceToEntityRow }

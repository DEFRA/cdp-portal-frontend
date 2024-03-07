import { config } from '~/src/config'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map'

function serviceToEntityRow(service) {
  const githubOrg = config.get('githubOrg')
  const status = service?.serviceStatus?.status
  const hasStatus = Boolean(status)

  // For services that are being created show, in-progress or failure tag. For created services show created date
  const createdEntity = hasStatus
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
      url: hasStatus
        ? `/services/create-status/${service.serviceName}`
        : `/services/${service.serviceName}`
    },
    {
      kind: 'list',
      value: service?.teams?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))
    },
    {
      kind: 'text',
      value: service.primaryLanguage
    },
    {
      kind: 'link',
      value: service.id,
      url: `https://github.com/${githubOrg}/${service.id}`,
      newWindow: true
    },
    createdEntity
  ]
}

export { serviceToEntityRow }

import { config } from '~/src/config/config.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'

function serviceToEntityRow(service) {
  const githubOrg = config.get('githubOrg')
  const status = service?.serviceStatus?.status
  const hasStatus = Boolean(status)
  const teams = service?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  // For services that are being created show, in-progress or failure tag. For created services show created date
  const createdEntity = hasStatus
    ? {
        kind: 'tag',
        value: formatText(status),
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
      kind: 'group',
      value: teams?.length ? teams : null
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

export { serviceToEntityRow }

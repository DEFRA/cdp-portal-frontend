import { statusTagClassMap } from '../../../common/helpers/status-tag-class-map.js'
import { serviceTags } from '../../../admin/tags/helpers/service-tags.js'
import { noValue } from '../../../common/constants/no-value.js'

function entityToEntityRow(entity) {
  const status = entity.status

  const teams = entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  const githubUrl = `https://github.com/DEFRA/${entity.name}`

  // For services that are being created show in-progress or failure tag. For created services show created date
  const creationState =
    status === 'Success' || status === 'Created'
      ? { date: entity.created }
      : {
          value: status,
          classes: statusTagClassMap(status)
        }

  return {
    isOwner: entity.isOwner,
    entityName: entity.name,
    teams,
    githubUrl,
    creationState,
    serviceType: entity.subType ?? entity.type ?? noValue,
    serviceTags: entity.tags?.map((tagName) => serviceTags[tagName]) ?? []
  }
}

export { entityToEntityRow }

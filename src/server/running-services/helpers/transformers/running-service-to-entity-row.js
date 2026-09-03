import { serviceTags } from '#server/admin/tags/helpers/service-tags.js'

function runningServiceToEntityRow({
  serviceName,
  environments: serviceEnvironments,
  teams,
  isOwner,
  tags
}) {
  return {
    isOwner,
    serviceName,
    serviceTeams: teams.filter((team) => team.teamId),
    serviceEnvironments,
    serviceTags: tags.map((tagName) => serviceTags[tagName]) ?? []
  }
}

export { runningServiceToEntityRow }

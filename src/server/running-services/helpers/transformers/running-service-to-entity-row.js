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
    serviceTags: tags.map(
      (tagName) => serviceTags[tagName] ?? decommissionTags[tagName]
    )
  }
}

const decommissionTags = {
  decommissioned: {
    name: 'decommissioned',
    displayName: 'Decommissioned',
    description:
      'The service has been decommissioned and should not be running',
    className: 'govuk-tag--red'
  },
  decommissioning: {
    name: 'decommissioning',
    displayName: 'Decommissioning',
    description:
      'The service is being decommissioned and may not be running shortly',
    className: 'govuk-tag--red'
  }
}

export { runningServiceToEntityRow }

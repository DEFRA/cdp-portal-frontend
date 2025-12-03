function runningServiceToEntityRow({
  serviceName,
  environments: serviceEnvironments,
  teams,
  isOwner
}) {
  return {
    isOwner,
    serviceName,
    serviceTeams: teams.filter((team) => team.teamId),
    serviceEnvironments
  }
}

export { runningServiceToEntityRow }

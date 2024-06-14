function decorateDeploymentTeams(deployedService, repositories) {
  if (!repositories) {
    return deployedService
  }
  const service = repositories.find(
    (s) => s.description === deployedService.service
  )
  if (!service?.teams) {
    return deployedService
  }
  return {
    ...deployedService,
    teams: service.teams
  }
}

export { decorateDeploymentTeams }

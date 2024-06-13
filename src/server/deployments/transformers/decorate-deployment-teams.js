function decorateDeploymentTeams(deployedService, services) {
  const service = services.find((s) => s.name === deployedService.service)
  return {
    ...deployedService,
    teams: service?.teams?.join(', ')
  }
}

export { decorateDeploymentTeams }

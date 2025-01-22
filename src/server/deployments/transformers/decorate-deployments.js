function decorateDeployments({ deployableServices, userScopeUUIDs }) {
  return (deployments) =>
    deployments?.map((deployment) => {
      const deployableService = deployableServices.find(
        (service) =>
          service.serviceName.toLowerCase() === deployment.service.toLowerCase()
      )

      const teams = deployableService?.teams ?? []

      return {
        teams,
        isOwner: teams.some((team) => userScopeUUIDs.includes(team.teamId)),
        ...deployment
      }
    })
}

export { decorateDeployments }

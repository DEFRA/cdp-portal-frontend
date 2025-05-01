function decorateDeployments({ deployableServices, userScopeUUIDs }) {
  return (deployments) =>
    deployments?.map(({ deployment, migration }) => {
      const entity = deployment ?? migration

      const deployableService = deployableServices.find(
        (service) =>
          service.serviceName.toLowerCase() === entity.service.toLowerCase()
      )

      const teams = deployableService?.teams ?? []

      return {
        teams,
        isOwner: teams.some((team) => userScopeUUIDs.includes(team.teamId)),
        ...entity,
        kind: deployment ? 'deployment' : 'migration'
      }
    })
}

export { decorateDeployments }

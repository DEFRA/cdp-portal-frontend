function decorateDeployments({ deployableServices }) {
  return (deployments) =>
    deployments?.map(({ deployment, migration, isFavourite }) => {
      const entity = deployment ?? migration

      const deployableService = deployableServices.find(
        (service) =>
          service.serviceName.toLowerCase() === entity.service.toLowerCase()
      )

      const teams = deployableService?.teams ?? []

      return {
        teams,
        isFavourite,
        ...entity,
        kind: deployment ? 'deployment' : 'migration'
      }
    })
}

export { decorateDeployments }

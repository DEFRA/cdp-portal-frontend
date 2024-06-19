function decorateDeployments(deployableServices) {
  return (deployments) =>
    deployments.map((deployment) => {
      const deployableService = deployableServices.find(
        (service) =>
          service.serviceName.toLowerCase() === deployment.service.toLowerCase()
      )

      return {
        teams: deployableService?.teams ?? [],
        ...deployment
      }
    })
}

export { decorateDeployments }

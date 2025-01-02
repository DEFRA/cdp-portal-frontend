function decorateDeployment(deployableServices) {
  return (deployment) => {
    const deployableService = deployableServices.find(
      (service) =>
        service.serviceName.toLowerCase() === deployment.service.toLowerCase()
    )

    return {
      teams: deployableService?.teams ?? [],
      ...deployment
    }
  }
}

export { decorateDeployment }

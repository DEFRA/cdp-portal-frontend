function createServiceStatusToService(serviceStatus) {
  const serviceName = serviceStatus?.repositoryName
  const team = {
    teamId: serviceStatus.team.teamId,
    name: serviceStatus.team.name
  }

  return {
    isCreateService: true,
    serviceName,
    githubUrl: serviceStatus?.createRepository?.url,
    id: serviceName,
    teams: [team],
    serviceStatus
  }
}

export { createServiceStatusToService }

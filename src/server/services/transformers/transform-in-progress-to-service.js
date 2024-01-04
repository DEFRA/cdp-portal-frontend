function transformInProgressToService(serviceStatus) {
  const serviceName = serviceStatus?.repositoryName
  const team = {
    teamId: serviceStatus.team.teamId,
    name: serviceStatus.team.name
  }

  return {
    isInProgress: true,
    serviceName,
    githubUrl: serviceStatus?.createRepository?.url,
    id: serviceName,
    teams: [team],
    serviceStatus
  }
}

export { transformInProgressToService }

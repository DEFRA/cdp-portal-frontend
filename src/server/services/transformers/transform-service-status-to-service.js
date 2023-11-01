/**
 * Transform the services create status into a similar shape as services from the Portal Backend
 */
function transformServiceStatusToService(serviceStatus) {
  const serviceName = serviceStatus?.repositoryName
  const team = serviceStatus?.owningTeam

  return {
    isCreateStatus: true,
    serviceName,
    githubUrl: serviceStatus?.createRepository?.url,
    id: serviceName,
    teams: [team],
    serviceStatus
  }
}

export { transformServiceStatusToService }

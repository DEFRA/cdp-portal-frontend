import Boom from '@hapi/boom'

function createServiceStatusToService(serviceStatus) {
  const serviceName = serviceStatus?.repositoryName

  if (!serviceName) {
    throw Boom.boomify(Boom.notFound())
  }

  const team = {
    teamId: serviceStatus.team.teamId,
    name: serviceStatus.team.name
  }

  return {
    isCreateService: true,
    serviceName,
    githubUrl: serviceStatus?.createRepository?.url,
    id: serviceName,
    teams: [team], // TODO support multiple teams in the API
    serviceStatus
  }
}

export { createServiceStatusToService }

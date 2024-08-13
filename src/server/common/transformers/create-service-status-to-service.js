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

  const repoUrl =
    serviceStatus['cdp-create-workflows']?.status === 'success'
      ? `https://github.com/DEFRA/${serviceName}`
      : ''

  return {
    isCreateService: true,
    serviceName,
    githubUrl: repoUrl,
    id: serviceName,
    teams: [team], // TODO support multiple teams in the API
    serviceStatus
  }
}

export { createServiceStatusToService }

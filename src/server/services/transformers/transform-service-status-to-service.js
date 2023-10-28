import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

/**
 * Transform the services create status into the same shape as services from the Portal Backend
 */
function transformServiceStatusToService(serviceStatus) {
  const serviceName = serviceStatus?.repositoryName
  const team = serviceStatus?.owningTeam
  const hasGitHubRepo = serviceStatus?.createRepository?.status === 'success'

  return {
    serviceName,
    githubUrl: hasGitHubRepo
      ? `https://github.com/${githubOrg}/${serviceName}`
      : null,
    id: serviceName,
    teams: [team],
    serviceStatus
  }
}

export { transformServiceStatusToService }

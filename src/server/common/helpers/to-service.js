import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'

/**
 * Provide a service which is:
 * - a deployable service
 * - a deployable service decorated with GitHub details
 * @param {string} serviceId
 * @returns {Promise<PartialObject<*>>}
 */
async function toService(serviceId) {
  const github = await fetchRepository(serviceId).catch(nullify404)
  const repository = github?.repository
    ? {
        ...github.repository,
        isFrontend: github.repository.topics?.includes('frontend') ?? false,
        isBackend: github.repository.topics?.includes('backend') ?? false,
        isTestSuite: github.repository.topics?.includes('test') ?? false
      }
    : null

  const deployableService = await fetchDeployableService(serviceId)

  if (deployableService === null && repository === null) {
    return null
  }

  return repositoryDecorator(
    { isDeployable: true, ...deployableService },
    repository
  )
}

export { toService }

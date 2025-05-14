import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'

/**
 * Provide a service which is:
 * - a deployable service
 * - a deployable service decorated with GitHub details
 * @param {string} serviceId
 * @returns {Promise<PartialObject<*>>}
 */
async function toService(serviceId) {
  const [github, deployableService, tenantServices] = await Promise.all([
    fetchRepository(serviceId).catch(nullify404),
    fetchDeployableService(serviceId),
    fetchTenantService(serviceId)
  ])

  const repository = github
    ? {
        ...github,
        isFrontend: github.topics?.includes('frontend') ?? false,
        isBackend: github.topics?.includes('backend') ?? false,
        isTestSuite: github.topics?.includes('test') ?? false
      }
    : null

  const meta = tenantServices
    ? {
        isPostgres: Object.values(tenantServices).some(
          (valueObj) => valueObj.postgres === true
        )
      }
    : {}

  if (deployableService === null && repository === null) {
    return null
  }

  return repositoryDecorator(
    { isDeployable: true, ...deployableService },
    repository,
    tenantServices,
    meta
  )
}

export { toService }

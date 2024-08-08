import { nullify404 } from '~/src/server/common/helpers/nullify-404'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'

/**
 * Provide a service which is:
 * - a deployable service
 * - a deployable service decorated with github details
 * @param serviceId
 * @param request
 * @returns {Promise<PartialObject<*>>}
 */
async function toService(serviceId, request) {
  const github = await request.server.methods
    .fetchRepository(serviceId)
    .catch(nullify404)
  const repository = github?.repository
    ? {
        ...github.repository,
        isFrontend: github.repository.topics?.includes('frontend') ?? false,
        isBackend: github.repository.topics?.includes('backend') ?? false
      }
    : null

  const deployableService =
    await request.server.methods.fetchDeployableService(serviceId)

  return repositoryDecorator(
    { isDeployable: true, ...deployableService },
    repository
  )
}

export { toService }

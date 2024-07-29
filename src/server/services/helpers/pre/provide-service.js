import { nullify404 } from '~/src/server/common/helpers/nullify-404'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'

/**
 * This prerequisite provides a value to `pre.service` which is:
 *  - a deployable service
 *  - a deployable service decorated with github details
 */
const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const github = await request.server.methods
      .fetchRepository(serviceId)
      .catch(nullify404) // TODO add to server methods
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
  },
  assign: 'service'
}

export { provideService }

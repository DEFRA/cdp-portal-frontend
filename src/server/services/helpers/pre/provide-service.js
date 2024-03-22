import { nullify404 } from '~/src/server/services/helpers/nullify-404'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'

/**
 * This prerequisite provides a value to `pre.service` which is:
 *  - a deployable service
 *  - a deployable service decorated with github details
 */
const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const github = await fetchRepository(serviceId).catch(nullify404)
    const repository = github?.repository
      ? {
          ...github.repository,
          isFrontend: github.repository.topics?.includes('frontend'),
          isBackend: github.repository.topics?.includes('backend')
        }
      : null

    const deployableService = await fetchDeployableService(serviceId)

    return repositoryDecorator(
      { isDeployable: true, ...deployableService },
      repository
    )
  },
  assign: 'service'
}

export { provideService }

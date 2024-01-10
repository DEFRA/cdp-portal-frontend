import { nullify404 } from '~/src/server/services/helpers/nullify-404'
import { decorateService } from '~/src/server/services/helpers/decorate-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch/fetch-deployable-service'

/**
 * This prerequisite provides a value to `pre.service` which is:
 *  - a deployable service
 *  - a deployable service decorated with github details
 */
const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const githubResponse = await fetchRepository(serviceId).catch(nullify404)
    const repository = githubResponse?.repository ?? null
    const deployableService = await fetchDeployableService(serviceId)

    return decorateService(
      { isDeployable: true, ...deployableService },
      repository
    )
  },
  assign: 'service'
}

export { provideService }

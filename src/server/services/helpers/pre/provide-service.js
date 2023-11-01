import { fetchRepository } from '~/src/server/services/helpers/fetch-repository'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch-deployable-service'
import { fetchCreateServiceStatus } from '~/src/server/services/helpers/fetch-create-service-status'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { decorateServiceWithGithubDetail } from '~/src/server/services/transformers/decorate-service-with-github-detail'

/**
 * This prerequisite provides a value to `pre.service` which is one of:
 *  - a deployable service decorated with github details
 *  - a transformed service creation status
 *  - a transformed service creation status decorated with github details
 *  - a 404
 *
 * Part 1)
 * Fetch github details from portalBackendApiUrl/repositories/${repositoryId}
 * Fetch deployable service from portalBackendApiUrl/services/${serviceId}
 * If both github details and deployable service exist, decorate and return service
 * If either of these 404, then
 *
 * Part 2)
 * Fetch the services creation status from selfServiceOpsApiUrl/create-service/status/${repositoryName}
 * If github details exist and service creation status exists, transform, decorate and return service
 * If no github details exist and service creation status exists, transform and return service
 *
 * If no service creation status exists 404
 *
 */

// This checks to see if things are ready
const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId
    let repositoryResponse

    try {
      const repositoryResponse = await fetchRepository(serviceId)
      const deployableService = await fetchDeployableService(serviceId)

      return decorateServiceWithGithubDetail(
        { isDeployable: true, ...deployableService },
        repositoryResponse.repository
      )
    } catch (error) {
      if (error?.output?.statusCode === 404) {
        const { status } = await fetchCreateServiceStatus(serviceId)
        const statusService = transformServiceStatusToService(status)

        if (repositoryResponse?.repository) {
          return decorateServiceWithGithubDetail(
            statusService,
            repositoryResponse?.repository
          )
        }

        return statusService
      }
    }
  },
  assign: 'service'
}

export { provideService }

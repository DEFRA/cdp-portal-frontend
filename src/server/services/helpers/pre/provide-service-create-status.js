import { isNull } from 'lodash'

import { nullify404 } from '~/src/server/services/helpers/nullify-404'
import { decorateService } from '~/src/server/services/helpers/decorate-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchCreateServiceStatus } from '~/src/server/services/helpers/fetch/fetch-create-service-status'
import { transformCreateServiceStatusToService } from '~/src/server/services/transformers/transform-create-service-status-to-service'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses'

/**
 * This prerequisite provides a value to `pre.service` which is:
 *  - a create service status
 *  - a create service status with github details
 */
const provideServiceCreateStatus = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const githubResponse = await fetchRepository(serviceId).catch(nullify404)
    const repository = githubResponse?.repository ?? null

    const createServiceStatusResponse =
      await fetchCreateServiceStatus(serviceId).catch(nullify404)
    const repositoryStatus =
      createServiceStatusResponse?.repositoryStatus ?? null

    // If is an XHR call and when the create service status is a success return null to make the poller to refresh
    // the page.
    if (
      request.isXhr() &&
      repositoryStatus?.status === creationStatuses.success
    ) {
      return null
    }

    const repositoryStatusService =
      transformCreateServiceStatusToService(repositoryStatus)

    if (!isNull(repository)) {
      return decorateService(repositoryStatusService, repository)
    }

    return repositoryStatusService
  },
  assign: 'service'
}

export { provideServiceCreateStatus }

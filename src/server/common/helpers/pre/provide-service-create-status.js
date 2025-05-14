import isNull from 'lodash/isNull.js'

import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'

import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchLegacyServiceStatus } from '~/src/server/common/helpers/fetch/fetch-legacy-service-status.js'

/**
 * This prerequisite provides a value to `pre.service` which is:
 *  - a create service status
 *  - a create service status with GitHub details
 *  - a service is currently a deployable artifact, a service or a test suite
 */
const provideServiceCreateStatus = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const repository = await fetchRepository(serviceId).catch(nullify404)

    const createServiceStatusResponse =
      await fetchLegacyServiceStatus(serviceId).catch(nullify404)
    const repositoryStatus = createServiceStatusResponse ?? null

    // If is an XHR call and when the create service status is a success return null to make the poller to refresh
    // the page.
    if (
      request.isXhr() &&
      repositoryStatus?.status === creationStatuses.success
    ) {
      return null
    }

    const repositoryStatusService =
      createServiceStatusToService(repositoryStatus)

    if (!isNull(repository)) {
      return repositoryDecorator(repositoryStatusService, repository)
    }

    return repositoryStatusService
  },
  assign: 'service'
}

export { provideServiceCreateStatus }

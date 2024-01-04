import { isNull } from 'lodash'

import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { decorateService } from '~/src/server/services/helpers/decorate-service'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch/fetch-deployable-service'
import { fetchUnfinishedService } from '~/src/server/services/helpers/fetch/fetch-unfinished-service'
import { fetchInProgressService } from '~/src/server/services/helpers/fetch/fetch-in-progress-service'
import { transformUnfinishedToService } from '~/src/server/services/transformers/transform-unfinished-to-service'
import { transformInProgressToService } from '~/src/server/services/transformers/transform-in-progress-to-service'

/**
 * This prerequisite provides a value to `pre.service` which is one of:
 *  - a deployable service decorated with github details
 *  - a transformed service creation status (in progress or unfinished)
 *  - a transformed service creation status decorated with github details
 *
 * Fetch github repository details from portalBackendApiUrl/repositories/{repositoryId}
 *
 * 1) Fetch an in progress service creation selfServiceOpsApiUrl/status/in-progress/{repositoryName}
 * If this in progress service creation exists, transform, decorate with github details if they exist and return
 *
 * 2) Fetch an unfinished service creation selfServiceOpsApiUrl/status/unfinished/{repositoryName}
 * If this unfinished service creation exists, transform, decorate with github details if they exist and return
 *
 * 3) Fetch a deployable service portalBackendApiUrl/services/{serviceId}
 * If this deployable service exists, decorate with github details if they exist and return
 *
 * Depending on which type of service is created we then provide different views based on the following properties:
 * - isInProgress
 * - isUnfinished
 * - isDeployable
 *
 */

const null404 = (error) => {
  if (error.output.statusCode === 404) {
    return null
  }

  throw error
}

const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId

    const githubResponse = await fetchRepository(serviceId).catch(null404)
    const repository = githubResponse?.repository ?? null

    const inProgressResponse =
      await fetchInProgressService(serviceId).catch(null404)
    const inProgress = inProgressResponse?.inProgress ?? null

    const unfinishedResponse =
      await fetchUnfinishedService(serviceId).catch(null404)
    const unfinished = unfinishedResponse?.unfinished ?? null

    const deployableService = await fetchDeployableService(serviceId)

    if (inProgress) {
      const inProgressService = transformInProgressToService(inProgress)

      if (!isNull(repository)) {
        return decorateService(inProgressService, repository)
      }

      return inProgressService
    }

    if (unfinished) {
      const unfinishedService = transformUnfinishedToService(unfinished)

      if (!isNull(repository)) {
        return decorateService(unfinishedService, repository)
      }

      return unfinishedService
    }

    return decorateService(
      { isDeployable: true, ...deployableService },
      repository
    )
  },
  assign: 'service'
}

export { provideService }

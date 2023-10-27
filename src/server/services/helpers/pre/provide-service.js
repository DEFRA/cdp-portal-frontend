import { fetchDeployableService } from '~/src/server/services/helpers/fetch-deployable-service'
import { fetchServiceCreateStatus } from '~/src/server/services/helpers/fetch-service-create-status'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch-repository'
import { decorateServiceWithGithubDetail } from '~/src/server/services/transformers/decorate-service-with-github-detail'

const provideService = {
  method: async function (request) {
    const serviceId = request.params?.serviceId
    let repositoryResponse

    try {
      const repositoryResponse = await fetchRepository(serviceId)
      const deployableService = await fetchDeployableService(serviceId)

      return decorateServiceWithGithubDetail(
        deployableService,
        repositoryResponse.repository
      )
    } catch (error) {
      if (error?.output?.statusCode === 404) {
        const { status } = await fetchServiceCreateStatus(serviceId)

        if (repositoryResponse?.repository) {
          return decorateServiceWithGithubDetail(
            transformServiceStatusToService(status),
            repositoryResponse?.repository
          )
        }

        return transformServiceStatusToService(status)
      }
    }
  },
  assign: 'service'
}

export { provideService }

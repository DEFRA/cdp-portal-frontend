import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'

const availableVersionsController = {
  handler: async (request, h) => {
    const serviceName = request.query?.serviceName
    return await fetchAvailableVersions(serviceName)
  }
}

export { availableVersionsController }

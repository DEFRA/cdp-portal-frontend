import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'

const availableVersionsController = {
  handler: (request) => {
    const serviceName = request.query?.serviceName
    return fetchAvailableVersions(serviceName)
  }
}

export { availableVersionsController }

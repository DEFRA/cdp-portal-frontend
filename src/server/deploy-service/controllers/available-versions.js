import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'

const availableVersionsController = {
  handler: async (request, h) => {
    try {
      const availableVersions = await fetchAvailableVersions(
        request.query?.serviceName
      )
      return availableVersions
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error.output.statusCode)
    }
  }
}

export { availableVersionsController }

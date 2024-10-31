import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'

const availableVersionsController = {
  handler: async (request, h) => {
    try {
      const availableVersions = await fetchAvailableVersions(
        request.query?.serviceName
      )

      return availableVersions.map((version) => ({
        text: version.tag,
        value: version.tag,
        hint: relativeDate(version.created)
      }))
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error.output.statusCode)
    }
  }
}

export { availableVersionsController }

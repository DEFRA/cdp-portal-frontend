import Boom from '@hapi/boom'

import { fetchAvailableVersions } from '../helpers/fetch/fetch-available-versions.js'
import { relativeDate } from '../../common/helpers/date/relative-date.js'

const availableVersionsController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

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

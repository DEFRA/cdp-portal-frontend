import Boom from '@hapi/boom'

import { fetchDeployServiceOptions } from '../../common/helpers/fetch/fetch-deploy-service-options.js'

const availableMemoryController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

    try {
      const cpu = request.query?.cpu

      const { ecsCpuToMemoryOptionsMap } = await fetchDeployServiceOptions()
      const availableMemoryOptions = ecsCpuToMemoryOptionsMap[cpu] ?? null

      if (!availableMemoryOptions) {
        return h.response({ message: 'Not found' }).code(404)
      }

      return availableMemoryOptions
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error.output.statusCode)
    }
  }
}

export { availableMemoryController }

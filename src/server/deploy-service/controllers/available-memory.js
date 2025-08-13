import Boom from '@hapi/boom'

import { fetchDeployServiceOptions } from '../../common/helpers/fetch/fetch-deploy-service-options.js'

const availableMemoryController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

    try {
      const cpu = request.query?.cpu
      const isPrototype = request.query?.isPrototype === 'true'
      const { ecsCpuToMemoryOptionsMap } = await fetchDeployServiceOptions()
      const options = {}

      if (isPrototype) {
        const reducedOptions = 3
        const reducedCpuToMemoryOptionsMap = Object.fromEntries(
          Object.entries(ecsCpuToMemoryOptionsMap)
            .slice(0, reducedOptions)
            .map(([key, value]) => [key, value.slice(0, reducedOptions)])
        )

        options.availableMemoryOptions =
          reducedCpuToMemoryOptionsMap[cpu] ?? null
      } else {
        options.availableMemoryOptions = ecsCpuToMemoryOptionsMap[cpu] ?? null
      }

      if (!options.availableMemoryOptions) {
        return h.response({ message: 'Not found' }).code(404)
      }

      return options.availableMemoryOptions
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error?.output?.statusCode ?? 500)
    }
  }
}

export { availableMemoryController }

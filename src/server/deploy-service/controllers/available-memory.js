import Boom from '@hapi/boom'

import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'

const availableMemoryController = {
  handler: async (request) => {
    try {
      const cpu = request.query?.cpu

      const { ecsCpuToMemoryOptionsMap } = await fetchDeployServiceOptions()
      const availableMemoryOptions = ecsCpuToMemoryOptionsMap[cpu]

      if (!availableMemoryOptions) {
        return Boom.boomify(Boom.notFound())
      }

      return availableMemoryOptions
    } catch (error) {
      return Boom.boomify(error)
    }
  }
}

export { availableMemoryController }

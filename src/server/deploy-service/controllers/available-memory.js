import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'

const availableMemoryController = {
  handler: async (request, h) => {
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

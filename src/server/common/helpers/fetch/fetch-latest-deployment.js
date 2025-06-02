import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

export async function fetchLatestDeployment(serviceName, environment, logger) {
  try {
    const endpoint =
      config.get('selfServiceOpsUrl') +
      `/deploy-service/info/${environment}/${serviceName}`

    const { deployment } = await fetchJson(endpoint)
    return deployment
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === statusCodes.notFound) {
      logger.info('Deployment not found')
    } else {
      logger.error(error)
    }
    return undefined
  }
}

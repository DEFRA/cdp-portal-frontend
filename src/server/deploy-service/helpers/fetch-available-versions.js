import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchAvailableVersions(serviceName) {
  // TODO fix up API. At the moment if no serviceName is provided then it returns /deployables endpoint JSON
  if (!serviceName) {
    return []
  }

  const logger = createLogger()
  const deployablesVersionsEndpoint = `${appConfig.get(
    'deployablesV1ApiUrl'
  )}/deployables/${serviceName}`

  try {
    const response = await fetch(deployablesVersionsEndpoint, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })

    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchAvailableVersions }

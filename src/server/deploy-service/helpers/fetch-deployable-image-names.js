import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchDeployableImageNames() {
  const logger = createLogger()
  const deployableImagesEndpointUrl = `${appConfig.get(
    'deployablesV1ApiUrl'
  )}/deployables`

  try {
    const response = await fetch(deployableImagesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployableImageNames }

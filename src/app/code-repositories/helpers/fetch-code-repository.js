import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchCodeRepository(repositoryId) {
  const logger = createLogger()
  const repositoryEndpointUrl = `${appConfig.get(
    'apiUrl'
  )}/code-repositories/${repositoryId}`

  try {
    const response = await fetch(repositoryEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchCodeRepository }

import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchCodeRepositories() {
  const logger = createLogger()
  const repositoriesEndpointUrl = `${appConfig.get('apiUrl')}/code-repositories`

  try {
    const response = await fetch(repositoriesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchCodeRepositories }

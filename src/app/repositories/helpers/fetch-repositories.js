import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRepositories() {
  const logger = createLogger()
  const repositoriesEndpointUrl = `${config.get('apiUrl')}/repositories`

  try {
    const response = await fetch(repositoriesEndpointUrl)
    const repositories = await response.json()

    return repositories
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRepositories }

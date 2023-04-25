import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRepository(repositoryId) {
  const logger = createLogger()
  const repositoryEndpointUrl = `${config.get(
    'apiUrl'
  )}/repositories/${repositoryId}`

  try {
    const response = await fetch(repositoryEndpointUrl)
    const repository = await response.json()

    return repository
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRepository }

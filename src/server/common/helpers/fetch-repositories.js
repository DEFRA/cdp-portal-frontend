import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchRepositories(teamId = null) {
  const logger = createLogger()
  const repositoriesEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/repositories${teamId ? `?team=${teamId}` : ''}`

  try {
    const response = await fetch(repositoriesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRepositories }

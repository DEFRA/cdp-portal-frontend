import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchLibraries(teamId = null) {
  const logger = createLogger()
  const templatesEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/libraries${teamId ? `?team=${teamId}` : ''}`

  try {
    const response = await fetch(templatesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchLibraries }

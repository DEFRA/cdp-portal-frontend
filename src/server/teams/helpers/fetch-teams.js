import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchTeams() {
  const logger = createLogger()
  const teamsEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/teams`

  try {
    const response = await fetch(teamsEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchTeams }

import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchTeam(teamId) {
  const logger = createLogger()
  const teamEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/teams/${teamId}`

  try {
    const response = await fetch(teamEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchTeam }

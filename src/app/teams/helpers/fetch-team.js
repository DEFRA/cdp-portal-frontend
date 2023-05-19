import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchTeam(teamId) {
  const logger = createLogger()
  const teamEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesV1ApiUrl'
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

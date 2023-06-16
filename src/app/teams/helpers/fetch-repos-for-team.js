import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchReposForTeam(teamId) {
  const logger = createLogger()
  const teamEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesV1ApiUrl'
  )}/services?team=${teamId}`

  try {
    const response = await fetch(teamEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchReposForTeam }

import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchTeams() {
  const logger = createLogger()
  const teamsEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesV1ApiUrl'
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

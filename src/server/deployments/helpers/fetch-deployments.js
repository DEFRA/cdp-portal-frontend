import qs from 'qs'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchDeployments(environment, queryParams) {
  const logger = createLogger()
  const queryString = qs.stringify(queryParams)

  const deploymentsEndpointUrl = `${appConfig.get(
    'deploymentsApiUrl'
  )}/deployments/${environment}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(deploymentsEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployments }

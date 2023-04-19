import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'
import { transformDeploymentsToEntities } from '~/src/app/deployments/transformers/transform-deployments-to-entities'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'

async function fetchDeploymentsList() {
  const logger = createLogger()
  const deploymentsEndpointUrl = `${config.get('apiUrl')}/deployments`

  try {
    const response = await fetch(deploymentsEndpointUrl)
    const deployments = await response.json()

    return deployments
      .sort(sortByTimestamp())
      .map(transformDeploymentsToEntities)
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeploymentsList }

import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformServicesToEntities } from '~/src/app/services/transformers/transform-services-to-entities'

async function fetchServicesList() {
  const logger = createLogger()
  const servicesEndpointUrl = `${config.get('apiUrl')}/services`

  try {
    const response = await fetch(servicesEndpointUrl)
    const services = await response.json()

    return services.sort(sortByTimestamp()).map(transformServicesToEntities)
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchServicesList }

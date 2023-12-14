import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

/**
 * @typedef {Object} serviceInfo - Service information
 * @property {int} [serviceInfo.desired_count] - desired instance count
 * @property {int} [serviceInfo.task_memory] - desired memory
 * @property {int} [serviceInfo.task_cpu] - desired cpu
 *
 * @param environment
 * @param imageName
 * @returns {Promise<serviceInfo>}
 */
async function fetchExistingServiceInfo(environment, imageName) {
  const existingServiceInfoEndpoint =
    config.get('selfServiceOpsApiUrl') +
    `/deploy-service/info/${environment}/${imageName}`

  const response = await fetch(existingServiceInfoEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  if (response.status === 404) {
    return null
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchExistingServiceInfo }

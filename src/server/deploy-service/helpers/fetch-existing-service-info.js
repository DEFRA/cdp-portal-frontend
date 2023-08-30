import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

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
    appConfig.get('selfServiceOpsApiUrl') +
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

  throw Error(json.message)
}

export { fetchExistingServiceInfo }

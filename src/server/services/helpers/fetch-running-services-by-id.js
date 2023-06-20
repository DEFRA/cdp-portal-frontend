import fetch from 'node-fetch'
import { appConfig } from '~/src/config'

async function fetchRunningServicesById(serviceId) {
  const runningServices = `${appConfig.get(
    'deploymentsV1ApiUrl'
  )}/whats-running-where/${serviceId}`

  const response = await fetch(runningServices)
  return await response.json()
}

export { fetchRunningServicesById }

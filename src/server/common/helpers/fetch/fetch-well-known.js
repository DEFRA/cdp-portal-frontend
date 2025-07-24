import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchWellknown() {
  const endpoint = config.get('oidcWellKnownConfigurationUrl')

  const { payload } = await fetchJson(endpoint)
  return payload ?? {}
}

export { fetchWellknown }

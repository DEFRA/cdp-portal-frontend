import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchWellknown() {
  const endpoint = config.get('oidcWellKnownConfigurationUrl')

  const { payload } = await fetchJson(endpoint)
  return payload ?? {}
}

export { fetchWellknown }

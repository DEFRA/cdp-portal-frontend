import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTemplates(name) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories/templates${name ? `/${name}` : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTemplates }

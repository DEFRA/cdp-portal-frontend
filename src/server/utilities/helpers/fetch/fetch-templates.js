import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchTemplates(name) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories/templates${name ? `/${name}` : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTemplates }

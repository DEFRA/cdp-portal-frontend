import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

const cdpPortalBackendUrl = config.get('portalBackendUrl')

export async function addTagToService(tag, service) {
  const endpoint = new URL(`/entities/${service}/tags`, cdpPortalBackendUrl)
  endpoint.searchParams.append('tag', tag)

  const { payload } = await fetchJson(endpoint.toString(), {
    method: 'post'
  })

  return payload
}

export async function removeTagFromService(tag, service) {
  const endpoint = new URL(`/entities/${service}/tags`, cdpPortalBackendUrl)
  endpoint.searchParams.append('tag', tag)

  const { payload } = await fetchJson(endpoint.toString(), {
    method: 'delete'
  })

  return payload
}

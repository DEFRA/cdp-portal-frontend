import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

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

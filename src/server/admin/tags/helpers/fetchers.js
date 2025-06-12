import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

const cdpPortalBackendUrl = config.get('portalBackendUrl')

export async function addTagToService(tag, service) {
  const endpoint =
    cdpPortalBackendUrl + `/entities/${service}/tags?` + qs.stringify({ tag })

  const { payload } = await fetchJson(endpoint, {
    method: 'post'
  })

  return payload
}

export async function removeTagFromService(tag, service) {
  const endpoint =
    cdpPortalBackendUrl + `/entities/${service}/tags?` + qs.stringify({ tag })

  const { payload } = await fetchJson(endpoint, {
    method: 'delete'
  })

  return payload
}

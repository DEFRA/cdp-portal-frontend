import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchLibraries(name) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories/libraries${name ? `/${name}` : ''}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchLibraries }

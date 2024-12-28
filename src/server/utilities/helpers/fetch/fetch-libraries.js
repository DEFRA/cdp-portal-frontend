import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchLibraries(name) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories/libraries${name ? '/name' : ''}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchLibraries }

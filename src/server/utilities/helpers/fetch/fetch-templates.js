import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTemplates(name = null) {
  const endpoint =
    config.get('portalBackendUrl') + '/repositories/templates' + name
      ? `/${name}`
      : ''

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTemplates }

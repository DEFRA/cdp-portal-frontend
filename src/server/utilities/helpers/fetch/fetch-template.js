import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTemplate(templateId) {
  const endpoint = config.get('portalBackendUrl') + `/templates/${templateId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTemplate }

import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCreateStatus(repositoryName) {
  const endpoint = config.get('selfServiceOpsUrl') + `/status/${repositoryName}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCreateStatus }

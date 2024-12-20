import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCreateStatus(repositoryName) {
  const endpoint = config.get('selfServiceOpsUrl') + `/status/${repositoryName}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchCreateStatus }

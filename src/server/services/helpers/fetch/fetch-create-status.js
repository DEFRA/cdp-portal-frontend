import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchCreateStatus(repositoryName) {
  const endpoint =
    config.get('selfServiceOpsApiUrl') + `/status/${repositoryName}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCreateStatus }

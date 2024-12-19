import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTeams(hasGithub = null) {
  const queryString = qs.stringify(
    {
      ...(hasGithub && { hasGithub })
    },
    { addQueryPrefix: true }
  )

  const endpoint = config.get('userServiceBackendUrl') + `/teams${queryString}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTeams }

import qs from 'qs'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTeams(hasGithub = null) {
  const queryString = qs.stringify(
    {
      ...(hasGithub && { hasGithub })
    },
    { addQueryPrefix: true }
  )

  const endpoint = config.get('userServiceApiUrl') + `/teams${queryString}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTeams }

import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTeams(hasGithub = null) {
  const queryString = qs.stringify(
    {
      ...(hasGithub && { hasGithub })
    },
    { addQueryPrefix: true }
  )

  const endpoint = config.get('userServiceBackendUrl') + `/teams${queryString}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTeams }

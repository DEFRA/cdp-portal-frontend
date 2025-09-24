import qs from 'qs'

import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchCdpTeams(hasGithub = null) {
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

export { fetchCdpTeams }

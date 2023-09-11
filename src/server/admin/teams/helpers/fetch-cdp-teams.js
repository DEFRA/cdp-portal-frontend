import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { isNil } from 'lodash'

async function fetchCdpTeams(auth) {
  const headers = { 'Content-Type': 'application/json' }
  const token = auth?.credentials?.token

  if (!isNil(token)) {
    headers.Authorization = `Bearer ${token}`
  }

  const teamsEndpointUrl = appConfig.get('userServiceApiUrl') + '/teams'

  const response = await fetch(teamsEndpointUrl, {
    method: 'get',
    headers
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchCdpTeams }

import Boom from '@hapi/boom'
import { config } from '~/src/config'
import fetch from 'node-fetch'
import qs from 'qs'

async function fetchDeployableImageNames(request) {
  const authedUser = await request.getUserSession()
  const userGroups = authedUser.scope

  request.logger.info(
    '---- user groups: ' + userGroups?.join(', ') ?? 'no groups'
  )

  const deployablesEndpointUrl =
    config.get('portalBackendApiUrl') +
    '/deployables' +
    qs.stringify(
      { runMode: 'service', groups: userGroups },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const response = await fetch(deployablesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployableImageNames }

import { config } from '../../../../config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export async function requestRepublishPlatformStateMessages(request) {
  const endpoint = `${selfServiceOpsUrl}/republish-platform-state-messages`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'post'
  })
  return payload
}

import { config } from '#config/config.js'

const portalBackendUrl = config.get('portalBackendUrl')

export async function triggerCdpCreateWorkflow(
  request,
  resourceType,
  resourceData
) {
  const endpoint = `${portalBackendUrl}/create/${resourceType}`

  request.logger.info(`create s3 bucket: ${JSON.stringify(resourceData)}`)
  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'post',
    payload: resourceData
  })
  return payload
}

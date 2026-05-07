import { config } from '#config/config.js'

const portalBackendUrl = config.get('portalBackendUrl')

/**
 *
 * @param {object} request
 * @param {string} entity
 * @param {object} resourceData
 * @return {Promise<{workflow_run_id: number, run_url: string, html_url: string}>}
 */
export async function requestTenantResource(request, entity, resourceData) {
  const endpoint = `${portalBackendUrl}/entities/${entity}/resources`

  request.logger.info(`create ${resourceData}: ${JSON.stringify(resourceData)}`)
  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'post',
    payload: resourceData
  })
  return payload
}

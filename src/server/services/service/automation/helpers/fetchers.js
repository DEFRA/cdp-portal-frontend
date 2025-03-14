import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

function saveAutoDeployDetails(details) {
  const endpoint = config.get('portalBackendUrl') + '/auto-deployments'

  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceId,
      environments: details.environments
    })
  })
}

async function getAutoDeployDetails(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/auto-deployments/${serviceName}`

    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    // We are catching here because a 404 is provided by the API and then thrown, when there are no auto-deploy
    // details saved
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(error, 'Tenant Service not found.')
    } else {
      logger.error(error)
    }

    return {}
  }
}

export { saveAutoDeployDetails, getAutoDeployDetails }

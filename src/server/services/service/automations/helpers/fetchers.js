import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()
const portalBackendUrl = config.get('portalBackendUrl')

async function getAutoDeployDetails(serviceName) {
  try {
    const endpoint = portalBackendUrl + `/auto-deployments/${serviceName}`

    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    // We are catching here because a 404 is provided by the API and then thrown, when there are no auto-deploy
    // details saved
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info('Tenant Service not found.')
    } else {
      logger.error(error)
    }

    return {}
  }
}

function saveAutoDeployDetails(details) {
  const endpoint = portalBackendUrl + '/auto-deployments'

  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceId,
      environments: details.environments
    })
  })
}

async function getAutoTestRunDetails(serviceName) {
  const endpoint = portalBackendUrl + `/auto-test-runs/${serviceName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

function saveAutoTestRunDetails(details) {
  const endpoint = portalBackendUrl + '/auto-test-runs'

  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceId,
      testSuite: details.testSuite,
      environments: details.environments
    })
  })
}

function removeAutoTestRun(serviceName, testSuite) {
  const endpoint = portalBackendUrl + '/auto-test-runs/remove-test-run'

  return fetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      serviceName,
      testSuite
    })
  })
}

function updateAutoTestRun(serviceName, payload) {
  const endpoint = portalBackendUrl + '/auto-test-runs/update-test-run'

  return fetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      serviceName,
      ...payload
    })
  })
}

async function fetchTestRepository(name) {
  const endpoint = portalBackendUrl + `/repositories/tests/${name}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchTeamTestRepositories(teamId) {
  const endpoint = portalBackendUrl + `/repositories/all/tests/${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload.repositories
}

export {
  getAutoDeployDetails,
  saveAutoDeployDetails,
  getAutoTestRunDetails,
  saveAutoTestRunDetails,
  fetchTeamTestRepositories,
  fetchTestRepository,
  removeAutoTestRun,
  updateAutoTestRun
}

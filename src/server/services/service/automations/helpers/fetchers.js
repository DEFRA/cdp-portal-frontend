import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { removeNil } from '#server/common/helpers/remove-nil.js'
import { createLogger } from '#server/common/helpers/logging/logger.js'

// TODO: Move to a Service layer

const logger = createLogger()
const portalBackendUrl = config.get('portalBackendUrl')

export async function getAutoDeployDetails(serviceName) {
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

export function saveAutoDeployDetails(details) {
  const endpoint = portalBackendUrl + '/auto-deployments'

  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceId,
      environments: details.environments
    })
  })
}

export async function getAutoTestRunDetails(serviceName) {
  const endpoint = portalBackendUrl + `/auto-test-runs/${serviceName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export function saveAutoTestRunDetails(details) {
  const endpoint = portalBackendUrl + '/auto-test-runs'

  const profile = details.provideProfile
    ? details.profile && details.profile.trim() !== ''
      ? details.profile
      : details.newProfile
    : undefined

  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceId,
      testSuite: details.testSuite,
      environments: details.environments,
      profile
    })
  })
}

export function removeAutoTestRun(serviceName, testSuite, profile) {
  const endpoint = portalBackendUrl + '/auto-test-runs/remove-test-run'

  return fetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      serviceName,
      testSuite,
      profile
    })
  })
}

export function updateAutoTestRun(serviceName, payload) {
  const endpoint = portalBackendUrl + '/auto-test-runs/update-test-run'

  return fetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      serviceName,
      ...payload
    })
  })
}

export async function getSchedules(serviceName) {
  const endpoint = `${portalBackendUrl}/schedules`

  // ${qs.stringify(queryParams, {
  //   arrayFormat: 'repeat',
  //   addQueryPrefix: true
  // })}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export async function createSchedule(teamId, task, config) {
  console.log(task, config)
  const endpoint = `${portalBackendUrl}/schedules`
  // TODO: use authoredFetchJson
  return fetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      teamId,
      task,
      config
    })
  })
}

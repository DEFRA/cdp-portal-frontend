import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchJson(endpoint) {
  const response = await fetch(endpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendApiUrl') + '/test-suite'
  return fetchJson(endpoint)
}

async function fetchTestSuite(name) {
  const endpoint = config.get('portalBackendApiUrl') + `/test-suite/${name}`
  return fetchJson(endpoint)
}

async function fetchTestRuns(testSuite) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/test-run?name=${testSuite}`
  return fetchJson(endpoint)
}

async function fetchTestRun(testRunId) {
  const endpoint = config.get('portalBackendApiUrl') + `/test-run/${testRunId}`
  return fetchJson(endpoint)
}

export { fetchTestRun, fetchTestRuns, fetchTestSuites, fetchTestSuite }

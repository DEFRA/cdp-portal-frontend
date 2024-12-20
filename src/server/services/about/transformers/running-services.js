import compose from 'lodash/fp/compose.js'

import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings.js'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'

/**
 * @typedef {object} Heading
 * @property {string} text
 * @property {string} size
 * /
 /**
 * @typedef {object} Row
 * @property {string} kind
 * @property {string} [value]
 * @property {string} [title]
 */

/**
 * Running services UI data transformation
 * @param {import('@hapi/hapi').Request} request
 * @returns {Promise<{environmentsWithADeployment: string[], runningServicesEntityRows: Row[], rowHeadings: Heading[]}>}
 */
async function provideRunningServicesData(request) {
  const serviceId = request.params?.serviceId
  const userViewableEnvironments = getEnvironments(
    request.auth.credentials?.scope
  )
  const runningServices = (await fetchRunningServicesById(serviceId)) ?? []
  const rowHeadings = buildRunningServicesRowHeadings(userViewableEnvironments)

  const runningServicesEntityRows = compose(
    runningServicesToEntityRow(userViewableEnvironments),
    withEnvironments
  )(runningServices)

  const environmentsWithADeployment = [
    ...new Set(runningServices.map((rs) => rs.environment))
  ]
    // .filter((env) => userViewableEnvironments.includes(env))
    .sort(sortByEnv)

  return { rowHeadings, runningServicesEntityRows, environmentsWithADeployment }
}

export { provideRunningServicesData }

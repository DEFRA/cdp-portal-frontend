import compose from 'lodash/fp/compose.js'

import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row.js'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

async function getAdditionalData(imageName, scopes) {
  if (!imageName) {
    return {
      availableVersionOptions: optionsWithMessage('choose an image name')
    }
  }

  const availableVersions = await fetchAvailableVersions(imageName)
  const availableVersionOptions = buildSuggestions(
    availableVersions.map((version) => ({
      text: version.tag,
      value: version.tag,
      hint: relativeDate(version.created)
    }))
  )
  const environments = getEnvironments(scopes)
  const runningServices = (await fetchRunningServicesById(imageName)) ?? []
  const runningServicesEntityRows = compose(
    runningServicesToEntityRow(environments),
    withEnvironments
  )(runningServices)
  const rowHeadings = buildRunningServicesRowHeadings(environments)

  return {
    runningServicesEntityRows,
    rowHeadings,
    availableVersionOptions,
    latestVersions: availableVersions.slice(0, 4)
  }
}

export { getAdditionalData }

import { compose } from 'lodash/fp'

import { relativeDate } from '~/src/server/common/helpers/date/relative-date'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'

async function getAdditionalData(imageName) {
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
  const service = await fetchDeployableService(imageName)
  const environments = getEnvironmentsByTeam(service?.teams)
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

import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { transformRunningServices } from '~/src/server/services/about/transformers/running-services.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

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
  const { runningServices } = await transformRunningServices(imageName)

  return {
    runningServices,
    availableVersionOptions,
    latestVersions: availableVersions.sort(sortBy('created')).slice(0, 6)
  }
}

export { getAdditionalData }

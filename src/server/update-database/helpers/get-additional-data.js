import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'
import { fetchMigrations } from '~/src/server/services/helpers/fetch/fetch-migrations.js'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { transformRunningServices } from '~/src/server/services/service/about/transformers/running-services.js'

async function getAdditionalData(imageName) {
  if (!imageName) {
    return {
      migrationOptions: optionsWithMessage('choose an image name')
    }
  }

  const migrations = await fetchMigrations(imageName)
  const dbChangeOptions = buildSuggestions(
    migrations.map((migration) => ({
      text: migration.version,
      value: migration.version,
      hint: relativeDate(migration.created)
    }))
  )
  const { runningServices } = await transformRunningServices(imageName)

  return {
    runningServices,
    dbChangeOptions,
    latestDbChanges: migrations.sort(sortBy('created')).slice(0, 6)
  }
}

export { getAdditionalData }

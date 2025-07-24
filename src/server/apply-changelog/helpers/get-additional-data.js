import { sortBy } from '../../common/helpers/sort/sort-by.js'
import { relativeDate } from '../../common/helpers/date/relative-date.js'
import { fetchAvailableMigrations } from '../../services/helpers/fetch/fetch-available-migrations.js'
import { optionsWithMessage } from '../../common/helpers/options/options-with-message.js'
import { buildSuggestions } from '../../common/components/autocomplete/helpers/build-suggestions.js'
import { transformRunningServices } from '../../services/service/about/transformers/running-services.js'

async function getAdditionalData(serviceName) {
  if (!serviceName) {
    return {
      migrationOptions: optionsWithMessage('choose a service name')
    }
  }

  const migrations = await fetchAvailableMigrations(serviceName)
  const dbChangeOptions = buildSuggestions(
    migrations.map((migration) => ({
      text: migration.version,
      value: migration.version,
      hint: relativeDate(migration.created)
    }))
  )
  const { runningServices } = await transformRunningServices(serviceName)
  const maxDbChanges = 6

  return {
    runningServices,
    dbChangeOptions,
    latestDbChanges: migrations.sort(sortBy('created')).slice(0, maxDbChanges)
  }
}

export { getAdditionalData }

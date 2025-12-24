import { creationStatuses } from '../../../common/constants/creation-statuses.js'
import { fetchEntities } from '../../../common/helpers/fetch/fetch-entities.js'

function isPostgresDeleteProtectionEnabled(entity) {
  const deleteStatuses = Object.values(entity?.environments ?? {}).map(
    (env) => env?.sql_database?.deletion_protection ?? false
  )
  return deleteStatuses.includes(true)
}

async function isDecommissioningInProgress() {
  const decommissioningEntities = await fetchEntities({
    status: creationStatuses.decommissioning
  })

  return decommissioningEntities.length > 0
}

export { isPostgresDeleteProtectionEnabled, isDecommissioningInProgress }

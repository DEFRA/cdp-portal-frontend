import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'
import { faviconState } from '~/src/server/common/constants/favicon-state.js'

/**
 * @param {string} migrationStatus
 * @returns {string}
 */
function databaseUpdateFaviconState(migrationStatus) {
  const stoppedStatuses = [databaseStatus.stopped, databaseStatus.timedOut]
  const pendingStatuses = [databaseStatus.inProgress, databaseStatus.requested]
  const failedStatuses = [databaseStatus.failed, databaseStatus.fault]
  let favicon

  if (pendingStatuses.includes(migrationStatus)) {
    favicon = faviconState.pending
  }

  if (migrationStatus === databaseStatus.succeeded) {
    favicon = faviconState.success
  }

  if (stoppedStatuses.includes(migrationStatus)) {
    favicon = faviconState.stopped
  }

  if (failedStatuses.includes(migrationStatus)) {
    favicon = faviconState.failed
  }

  return favicon
}

export { databaseUpdateFaviconState }

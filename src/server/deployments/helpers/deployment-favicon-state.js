import { deploymentStatus } from '~/src/server/common/constants/deployment.js'
import { faviconState } from '~/src/server/common/constants/favicon-state.js'

/**
 * @param {string} status
 * @returns {string}
 */
function deploymentFaviconState(status) {
  const pendingStatuses = [
    deploymentStatus.stopping,
    deploymentStatus.pending,
    deploymentStatus.requested
  ]
  let favicon

  if (pendingStatuses.includes(status)) {
    favicon = faviconState.pending
  }

  if (status === deploymentStatus.running) {
    favicon = faviconState.success
  }

  if (status === deploymentStatus.stopped) {
    favicon = faviconState.stopped
  }

  if (status === deploymentStatus.failed) {
    favicon = faviconState.failed
  }

  return favicon
}

export { deploymentFaviconState }

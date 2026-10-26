import { config } from '#config/config.js'
import { deploymentStatus } from '#server/common/constants/deployment.js'

const changeRequestRecentWindowMs = config.get('changeRequestRecentWindowMs')

export function formatChangeRecord(deployment) {
  const { created, serviceNowChangeRequest: changeRequest } = deployment
  const { status, changeRequestNumber } = changeRequest ?? {}

  if (status === 'created' && changeRequestNumber) {
    return { text: changeRequestNumber }
  }

  const isRecent =
    created &&
    Date.now() - new Date(created).getTime() < changeRequestRecentWindowMs

  if (
    isRecent &&
    [deploymentStatus.requested, deploymentStatus.pending].includes(
      deployment.status
    )
  ) {
    return {
      text: 'Pending',
      class: 'app-tag--purple'
    }
  }

  if (isRecent && ['requested', 'pending'].includes(status)) {
    return {
      text: 'Requested',
      class: 'app-tag--purple'
    }
  }

  if (status === 'failed') {
    return {
      text: 'Not Created',
      class: 'app-tag--orange'
    }
  }

  return {
    text: 'Not Requested',
    class: 'govuk-tag--red'
  }
}

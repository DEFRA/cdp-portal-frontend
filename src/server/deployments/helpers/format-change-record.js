import { config } from '#config/config.js'

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

  if (isRecent && ['requested', 'pending'].includes(status)) {
    return {
      text: 'Requested',
      class: 'app-tag--purple'
    }
  }

  return {
    text: 'Not Requested',
    class: 'govuk-tag--red'
  }
}

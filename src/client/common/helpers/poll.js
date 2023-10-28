import { addMinutes, isBefore } from 'date-fns'

import { xhrRequest } from '~/src/client/common/helpers/xhr'
import { clientNotification } from '~/src/client/common/helpers/client-notification'

/**
 * Poll a Portal Server Url, using the xhrRequest
 * @param pollingStarted
 * @param maxPoll, max polling time in minutes. After this period, polling is paused
 * @returns {(function(*, *=): Promise<void>)|*}
 */
function startPolling(pollingStarted, maxPoll) {
  return async function pollUrl(url, interval = 1000) {
    const response = await xhrRequest(url)
    const ok = response?.ok

    const runningLessThanPollLimit = isBefore(
      Date.now(),
      addMinutes(pollingStarted, maxPoll)
    )

    if (ok && runningLessThanPollLimit) {
      setTimeout(() => {
        pollUrl(url, interval)
      }, interval)
    }

    if (!ok) {
      clientNotification('Issue polling')
    }

    if (!runningLessThanPollLimit) {
      clientNotification('Refresh the page to continue polling', 'info')
    }
  }
}

function poll($element) {
  if (!$element) {
    return
  }

  const fiveSeconds = 5000
  const sixtyMinutes = 60

  const pollUrl = $element.dataset?.pollUrl
  const pollInterval = $element.dataset?.pollInterval
  const interval = pollInterval ? parseInt(pollInterval, 10) : fiveSeconds

  const pollingLimit = $element.dataset?.pollingLimit
  const maxPoll = pollingLimit ? parseInt(pollingLimit, 10) : sixtyMinutes

  startPolling(Date.now(), maxPoll)(pollUrl, interval)
}

export { poll }

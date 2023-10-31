import { addMinutes, isBefore } from 'date-fns'

import { xhrRequest } from '~/src/client/common/helpers/xhr'
import { clientNotification } from '~/src/client/common/helpers/client-notification'

/**
 *
 * @param {string} url - poll url
 * @param {number} [interval=5000] - poll interval
 * @param {number} [limit=60] - poll limit in minutes. After this period, polling is paused
 * @param {number} pollBegin - when the poll started
 * @returns {(function(): Promise<void>)|*}
 */
function startPolling(url, interval, limit, pollBegin) {
  return async function pollUrl() {
    const isBeforePollLimit = isBefore(Date.now(), addMinutes(pollBegin, limit))
    const { ok, text } = await xhrRequest(url)

    if (ok && !text) {
      window.location.reload()
    }

    if (!ok) {
      clientNotification('There has been a polling issue, refresh the page')
    }

    if (!isBeforePollLimit) {
      clientNotification(
        `Poll limit of ${limit} minutes exceeded, refresh the page`,
        'info'
      )
    }

    if (ok && isBeforePollLimit) {
      setTimeout(() => {
        pollUrl()
      }, interval)
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

  const pollLimit = $element.dataset?.pollLimit
  const limit = pollLimit ? parseInt(pollLimit, 10) : sixtyMinutes

  startPolling(pollUrl, interval, limit, Date.now())()
}

export { poll }

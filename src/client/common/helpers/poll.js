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
    const timerInfo = {}

    // TODO roll out the data xhrStop, xhrSuccessMessage, xhrErrorMessage attribute to all pollers
    const domParser = new DOMParser()
    const dataDocument = domParser.parseFromString(text, 'text/html')
    const xhrElement = dataDocument.querySelector('[data-xhr]')
    const shouldStopPolling = xhrElement?.dataset?.xhrStop === 'true' || false
    const successMessage = xhrElement?.dataset?.xhrSuccessMessage
    const errorMessage = xhrElement?.dataset?.xhrErrorMessage

    // TODO (ok and !text) clause can go once all pollers have the xhrStop attribute
    if ((ok && !text) || shouldStopPolling) {
      if (successMessage) {
        clientNotification(successMessage, 'success')
      }

      if (errorMessage) {
        clientNotification(errorMessage)
      }

      if (timerInfo?.id) {
        clearTimeout(timerInfo.id)
      }

      return
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
      timerInfo.id = setTimeout(() => {
        pollUrl()
      }, interval)
    }
  }
}

/**
 * @param {HTMLElement | undefined | null} $module - HTML element to use for polling
 */
function poll($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  const fiveSeconds = 5000
  const sixtyMinutes = 60

  const pollUrl = $module.dataset?.pollUrl

  const pollInterval = $module.dataset?.pollInterval
  const interval = pollInterval ? parseInt(pollInterval, 10) : fiveSeconds

  const pollLimit = $module.dataset?.pollLimit
  const limit = pollLimit ? parseInt(pollLimit, 10) : sixtyMinutes

  startPolling(pollUrl, interval, limit, Date.now())()
}

export { poll }

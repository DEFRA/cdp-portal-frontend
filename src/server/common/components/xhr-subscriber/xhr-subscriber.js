import { xhrRequest } from '../../../../client/common/helpers/xhr.js'
import { subscribe } from '../../../../client/common/helpers/event-emitter.js'
import { clientNotification } from '../../../../client/common/helpers/client-notification.js'

/**
 * Trigger a xhr request from a published, subscribed to event
 * @param {HTMLElement | undefined | null} $module - HTML element to use for button
 */
function xhrSubscriber($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  const subscribeTo = $module.dataset.subscribeTo
  const xhrUrl = $module.dataset.xhrUrl

  subscribe(subscribeTo, async ({ detail }) => {
    const { ok } = await xhrRequest(xhrUrl, detail?.queryParams)

    if (!ok) {
      clientNotification('Could not fetch details, refresh the page')
    }
  })
}

export { xhrSubscriber }

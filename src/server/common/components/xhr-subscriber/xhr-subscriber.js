import qs from 'qs'

import { xhrRequest } from '~/src/client/common/helpers/xhr.js'
import { subscribe } from '~/src/client/common/helpers/event-emitter.js'
import { clientNotification } from '~/src/client/common/helpers/client-notification.js'

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
    const queryParamString = detail?.queryParams
      ? qs.stringify(detail?.queryParams, {
          addQueryPrefix: true
        })
      : ''
    const url = xhrUrl + queryParamString

    const { ok } = await xhrRequest(url)

    if (!ok) {
      clientNotification('Could not fetch details, refresh the page')
    }
  })
}

export { xhrSubscriber }

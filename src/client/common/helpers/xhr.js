import qs from 'qs'
import { Action } from 'history'

import { history } from '~/src/client/common/helpers/history.js'

import { publish } from '~/src/client/common/helpers/event-emitter.js'
import { eventName } from '~/src/client/common/constants/event-name.js'

/**
 * Update data-xhr elements inside {% block xhrContent %}{% endblock %} with the contents of data-xhr elements
 * of the same name returned from the Xhr request
 * @param {string} text - text/html returned from the Xhr request
 */
function injectHtmlResponseIntoPage(text) {
  const domParser = new DOMParser()
  const xhrDataDocument = domParser.parseFromString(text, 'text/html')

  const xhrContainers = Array.from(document.querySelectorAll('[data-xhr]'))

  xhrContainers.forEach((xhrContainer) => {
    const xhrContainerId = xhrContainer.dataset?.xhr

    const xhrContent = xhrDataDocument.querySelector(
      `[data-xhr="${xhrContainerId}"]`
    )

    if (xhrContent) {
      xhrContainer.replaceWith(xhrContent)
    }
  })

  // TODO refactor
  // Replace elements in page with XHR data from the server
  const xhrElements = Array.from(
    document.querySelectorAll('[data-xhr-element]')
  )

  xhrElements.forEach((xhrElement) => {
    const xhrElementId = xhrElement.dataset?.xhrElement

    // Found matching xhr content in the response
    const xhrContent = xhrDataDocument.querySelector(
      `[data-xhr-element="${xhrElementId}"]`
    )

    // Update dom with xhr content
    if (xhrContent) {
      xhrElement.replaceWith(xhrContent)
    }
  })
}

function updatePage(text, params = {}) {
  injectHtmlResponseIntoPage(text)

  publish(eventName.xhrUpdate, { params })

  if (params) {
    const url = qs.stringify(params, {
      arrayFormat: 'repeat',
      addQueryPrefix: true
    })

    try {
      history.replace(url, { xhrData: text }) // Data saved to state for forward/back button replay
    } catch (error) {
      window.location.assign(url) // State is too large for the browser to handle, reload page
    }
  }
}

/**
 * Xhr request used to populate {% block xhrContent %}{% endblock %}
 * @param {string} url
 * @param {Record<string, string>} params
 * @returns {Promise<{text: string, ok: boolean}|{ok: boolean, error}>}
 */
async function xhrRequest(url, params = {}) {
  try {
    const queryParams = qs.stringify(params, {
      arrayFormat: 'repeat',
      addQueryPrefix: true
    })

    history.push(queryParams)

    const response = await fetch(url + queryParams, {
      cache: 'no-store',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store, max-age=0',
        Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
        Pragma: 'no-cache'
      }
    })

    const text = await response.text()
    updatePage(text, params)

    return { ok: true, text }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * Provide forward/back history when using xhr
 */
function addHistoryListener() {
  /**
   * @typedef {object} Options
   * @property {Location} location
   * @property {Action} action
   */
  /**
   * Listen for history changes and inject the xhr data into the page
   * @param {Options} options
   */
  return history.listen(({ action, location }) => {
    if (action === Action.Pop) {
      if (location?.state) {
        injectHtmlResponseIntoPage(location.state.xhrData)
      } else if (
        window.location.pathname !== location?.pathname &&
        window.location.search !== location?.search
      ) {
        window.location.href = location?.pathname + location?.search
      } else {
        // do nothing
      }
    }
  })
}

/**
 * import {Location} from 'history
 */

export { xhrRequest, addHistoryListener }

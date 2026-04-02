import qs from 'qs'
import { Action } from 'history'
import pRetry from 'p-retry'

import { history } from './history.js'

import { publish } from './event-emitter.js'
import { eventName } from '../constants/event-name.js'

/**
 * Update data-xhr elements in the DOM inside xhrContent or xhrHeadContent nunjucks blocks with the contents of
 * data-xhr elements received via a Xhr request
 * @param {string} xhrDocument
 */
function updateWithXhrContent(xhrDocument) {
  const $elements = Array.from(document.querySelectorAll('[data-xhr]'))

  $elements.forEach((xhrContainer) => {
    const xhrContainerId = xhrContainer.dataset?.xhr

    const $xhrContent = xhrDocument.querySelector(
      `[data-xhr="${xhrContainerId}"]`
    )

    if ($xhrContent) {
      xhrContainer.replaceWith($xhrContent)
    }
  })
}

function updatePageTitle(xhrDocument) {
  const $pageTitle = document.querySelector('title')
  const $xhrPageTitle = xhrDocument.querySelector(`[data-xhr-page-title]`)

  if ($xhrPageTitle) {
    $pageTitle.textContent = $xhrPageTitle.textContent
  }
}

/**
 * Update data-xhr elements inside {% block xhrContent %}{% endblock %} with the contents of data-xhr elements
 * of the same name returned from the Xhr request
 * @param {string} text - text/html returned from the Xhr request
 */
function injectHtmlResponseIntoPage(text) {
  const domParser = new DOMParser()
  const xhrDataDocument = domParser.parseFromString(text, 'text/html')

  updateWithXhrContent(xhrDataDocument)
  updatePageTitle(xhrDataDocument)
}

function updatePage(text, params = {}, newUrl = '') {
  injectHtmlResponseIntoPage(text)

  publish(eventName.xhrUpdate, { params })

  if (params) {
    const url =
      newUrl +
      qs.stringify(params, {
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

    const response = await pRetry(
      async () => {
        const tryResponse = await fetch(url + queryParams, {
          cache: 'no-store',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache, no-store, max-age=0',
            Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
            Pragma: 'no-cache'
          }
        })

        if (!tryResponse.ok) throw new Error(tryResponse.statusText)
        return tryResponse
      },
      { retries: 2, minTimeout: 500 }
    )

    if (!response.ok) return { ok: false, error: response.status }

    const text = await response.text()
    updatePage(text, params)

    return { ok: true, text }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * Xhr POST request used to populate {% block xhrContent %}{% endblock %}
 * @param {string} url
 * @param {Record<string, string>} params
 * @returns {Promise<{text: string, ok: boolean}|{ok: boolean, error}>}
 */
async function xhrPostRequest(url, payload = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store, max-age=0',
        Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
        Pragma: 'no-cache'
      },
      body: new URLSearchParams(
        Object.entries(payload).flatMap(([key, values]) =>
          Array.isArray(values)
            ? values.map((value) => [key, value])
            : [[key, values]]
        )
      ),
      redirect: 'follow'
    })

    if (!response.ok) return { ok: false, error: response.status }

    const text = await response.text()

    updatePage(text, {}, response.url)

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
 * import {Location} from 'history'
 */

export { xhrRequest, xhrPostRequest, addHistoryListener }

import qs from 'qs'
import { Action } from 'history'
import pRetry from 'p-retry'

import { history } from './history.js'
import { publish } from './event-emitter.js'
import { eventName } from '../constants/event-name.js'

/**
 * Update data-xhr elements in the DOM inside xhrContent or xhrHeadContent nunjucks blocks
 * @param {string} xhrDocument
 * @param {string} xhrTarget
 */
function updateWithXhrContent(xhrDocument, xhrTarget) {
  const elements = Array.from(document.querySelectorAll('[data-xhr]'))

  const elementsToUpdate = xhrTarget
    ? elements.filter((element) => element.dataset?.xhr === xhrTarget)
    : elements

  elementsToUpdate.forEach((xhrContainer) => {
    const xhrContainerId = xhrContainer.dataset?.xhr

    const xhrContent = Array.from(
      xhrDocument.querySelectorAll('[data-xhr]')
    ).find((element) => element.dataset?.xhr === xhrContainerId)

    if (xhrContent) {
      xhrContainer.replaceWith(xhrContent)
    }
  })
}

function updatePageTitle(xhrDocument) {
  const pageTitle = document.querySelector('title')
  const xhrPageTitle = xhrDocument.querySelector('[data-xhr-page-title]')

  if (xhrPageTitle) {
    pageTitle.textContent = xhrPageTitle.textContent
  }
}

/**
 * Update data-xhr elements inside xhrContent with the contents received from the XHR request.
 * @param {string} text
 * @param {string} xhrTarget
 */
function injectHtmlResponseIntoPage(text, xhrTarget) {
  const domParser = new DOMParser()
  const xhrDataDocument = domParser.parseFromString(text, 'text/html')

  updateWithXhrContent(xhrDataDocument, xhrTarget)
  updatePageTitle(xhrDataDocument)
}

export function updatePage(text, params = {}, newUrl = '', xhrTarget) {
  injectHtmlResponseIntoPage(text, xhrTarget)

  publish(eventName.xhrUpdate, { params })

  if (params) {
    const url =
      newUrl +
      qs.stringify(params, {
        arrayFormat: 'repeat',
        addQueryPrefix: true
      })

    try {
      history.replace(url, {
        xhrData: text,
        xhrTarget
      })
    } catch (error) {
      window.location.assign(url)
    }
  }
}

/**
 * XHR request used to populate xhrContent.
 * @param {string} url
 * @param {Record<string, string>} params
 * @param {string} xhrTarget
 * @returns {Promise<{text: string, ok: boolean}|{ok: boolean, error}>}
 */
export async function xhrRequest(url, params = {}, xhrTarget) {
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

        if (!tryResponse.ok) {
          throw new Error(tryResponse.statusText)
        }

        return tryResponse
      },
      { retries: 2, minTimeout: 500 }
    )

    if (!response.ok) {
      return { ok: false, error: response.status }
    }

    const text = await response.text()

    updatePage(text, params, '', xhrTarget)

    return { ok: true, text }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * XHR POST request used to populate xhrContent.
 * @param {string} url
 * @param {Record<string, string>} payload
 * @returns {Promise<{text: string, ok: boolean}|{ok: boolean, error}>}
 */
export async function xhrPostRequest(url, payload = {}) {
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

    if (!response.ok) {
      return { ok: false, error: response.status }
    }

    const text = await response.text()

    updatePage(text, {}, response.url)

    return { ok: true, text }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * Provide forward/back history when using xhr.
 */
export function addHistoryListener() {
  return history.listen(({ action, location }) => {
    if (action === Action.Pop) {
      if (location?.state) {
        injectHtmlResponseIntoPage(
          location.state.xhrData,
          location.state.xhrTarget
        )
      } else if (
        window.location.pathname !== location?.pathname &&
        window.location.search !== location?.search
      ) {
        window.location.href = location?.pathname + location?.search
      }
      // otherwise do nothing
    }
  })
}

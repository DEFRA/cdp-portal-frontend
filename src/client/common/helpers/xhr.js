import qs from 'qs'
import { createBrowserHistory } from 'history'

import { publish } from '~/src/client/common/helpers/event-emitter'
import { eventName } from '~/src/client/common/constants/event-name'

const history = createBrowserHistory()

/**
 * Update data-xhr elements inside {% block xhrContent %}{% endblock %} with the contents of data-xhr elements
 * of the same name returned from the Xhr request
 *
 * @param text - text/html returned from the Xhr request
 */
function injectHtmlResponseIntoPage(text) {
  const domParser = new DOMParser()
  const dataDocument = domParser.parseFromString(text, 'text/html')

  const xhrContainers = Array.from(document.querySelectorAll('[data-xhr]'))

  xhrContainers.forEach((xhrContainer) => {
    const xhrContainerId = xhrContainer.dataset?.xhr

    const xhrContent = dataDocument.querySelector(
      `[data-xhr="${xhrContainerId}"]`
    )

    if (xhrContent) {
      xhrContainer.outerHTML = xhrContent.outerHTML
    }
  })
}

function updatePage(text, params = {}) {
  injectHtmlResponseIntoPage(text)

  publish(eventName.xhrUpdate, { params })

  if (params) {
    const url = qs.stringify(params, { addQueryPrefix: true })

    try {
      history.replace(url, { xhrData: text }) // Data saved to state for forward/back button replay
    } catch (error) {
      window.location.assign(url) // State is too large for the browser to handle, reload page
    }
  }
}

/**
 * Xhr request used to populate {% block xhrContent %}{% endblock %}
 *
 * @param url
 * @param params
 * @returns {Promise<{text: string, ok: boolean}|{ok: boolean, error}>}
 */
async function xhrRequest(url, params = {}) {
  try {
    if (params) {
      const url = qs.stringify(params, { addQueryPrefix: true })
      history.push(url)
    }

    const response = await fetch(
      `${url}${qs.stringify(params, {
        arrayFormat: 'repeat',
        addQueryPrefix: true
      })}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache'
        }
      }
    )

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
  return history.listen(({ action, location }) => {
    if (action === 'POP') {
      if (location?.state) {
        injectHtmlResponseIntoPage(location.state.xhrData)
      } else if (
        window.location.pathname !== location?.pathname &&
        window.location.search !== location?.search
      ) {
        window.location.href = location?.pathname + location?.search
      }
    }
  })
}

export { xhrRequest, addHistoryListener }

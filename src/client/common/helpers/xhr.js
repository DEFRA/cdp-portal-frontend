import qs from 'qs'
import { createBrowserHistory } from 'history'

import { publish } from '~/src/client/common/helpers/event-emitter'
import { eventName } from '~/src/client/common/constants/event-name'

const history = createBrowserHistory()

function injectResponseInHtml(html) {
  const domParser = new DOMParser()
  const dataDocument = domParser.parseFromString(html, 'text/html')

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

function updatePage(html, params = {}) {
  injectResponseInHtml(html)

  publish(eventName.xhrUpdate, { params })

  if (params) {
    const url = qs.stringify(params, { addQueryPrefix: true })

    try {
      history.replace(url, { xhrData: html }) // Data saved to state for forward/back button replay
    } catch (error) {
      window.location.assign(url) // State is too large for the browser to handle, reload page
    }
  }
}

/**
 * Xhr request, used via auto submit forms and detected via isXhr value in Nunjucks context
 * @param url
 * @param params
 * @returns {Promise<void>}
 */
function xhrRequest(url, params = {}) {
  if (params) {
    const url = qs.stringify(params, { addQueryPrefix: true })
    history.push(url)
  }

  return fetch(
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
    .then((response) => {
      return response.text()
    })
    .then((text) => {
      updatePage(text, params)
    })
}

/**
 * Provide forward/back button xhr loading in entity lists
 */
function addHistoryListener() {
  history.listen(({ action, location }) => {
    if (action === 'POP') {
      if (location?.state) {
        injectResponseInHtml(location.state.xhrData)
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

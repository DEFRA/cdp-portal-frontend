import { escape } from 'lodash'

/**
 * Sets the host, protocol and port of a URL to use the external address
 * (e.g. http://localhost:3000/foo?a=b https://portal.cdp-int.defra.cloud/foo?a=b).
 * @param {string|module:url.URL} url
 * @param {string|module:url.URL}  external
 * @returns {module:url.URL}
 */
export function asExternalUrl(url, external) {
  const currentUrl = new URL(url)
  const externalUrl = new URL(external)
  currentUrl.protocol = externalUrl.protocol
  currentUrl.hostname = externalUrl.hostname
  currentUrl.port = externalUrl.port

  return currentUrl
}

/**
 * Borrowed from hapi/bell
 * Workaround for some browsers where due to CORS and the redirection method, the state
 * cookie is not included with the request unless the request comes directly from the same origin.
 */
export const redirectWithRefresh = (h, redirect) => {
  return h
    .response(
      `<html><head><meta http-equiv="refresh" content="0;URL='${escape(redirect)}'"></head><body></body></html>`
    )
    .takeover()
}

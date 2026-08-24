import { xhrRequest } from './xhr.js'

/**
 * Turns links into xhr requests
 *
 * NOTE: Add to a container ABOVE the {% block xhrContent %} declaration
 *
 * Add `data-no-xhr-link="true"` to a link to opt out
 */

export default async function xhrNav($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  $module.addEventListener('click', nav)
}

async function nav(event) {
  if (
    (!event.target) instanceof HTMLAnchorElement ||
    !event.target.href ||
    event.target.dataset?.noXhrLink
  ) {
    return
  }

  event.preventDefault()

  const urlSearchParams = new URLSearchParams(window.location.search)
  const urlParams = Object.fromEntries(urlSearchParams.entries())

  const { ok } = await xhrRequest(event.target.href, urlParams)

  if (!ok) {
    window.location.href = event.target.href
  }

  return false
}

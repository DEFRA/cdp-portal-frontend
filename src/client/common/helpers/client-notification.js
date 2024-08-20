/** @typedef {"success" | "info" | "error" | "action"} Kind */

/**
 * Client Side Notification
 * @param {string} textContent
 * @param {Kind} [kind] - defaults to an error banner
 */
function clientNotification(textContent, kind = 'error') {
  const $clientNotification = document.querySelector(
    '[data-js="app-client-notifications"]'
  )
  const $clientMessageHolder = $clientNotification.querySelector(
    '[data-js="app-client-notifications-content"]'
  )

  if (kind) {
    $clientNotification.classList.remove('app-banner--error')
    $clientNotification.classList.add(`app-banner--${kind}`)
  }

  // clear down any server side banners
  const $appNotifications = Array.from(
    document.querySelectorAll('[data-js="app-notification"]')
  )
  $appNotifications.forEach(($notification) => $notification.remove())

  $clientMessageHolder.textContent = textContent
  $clientNotification.classList.remove('app-banner--hidden')

  const twentySeconds = 20000

  if (kind !== 'error') {
    setTimeout(function () {
      $clientNotification.remove()
    }, twentySeconds)
  }
}

export { clientNotification }

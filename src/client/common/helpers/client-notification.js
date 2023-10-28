function clientNotification(textContent = 'Something went wrong', kind) {
  const clientNotification = document.querySelector(
    '[data-js="app-client-notifications"]'
  )
  const clientMessageHolder = clientNotification.querySelector(
    '.app-banner__content'
  )

  if (kind) {
    clientNotification.classList.remove('app-banner--error')
    clientNotification.classList.add(`app-banner--${kind}`)
  }

  clientMessageHolder.textContent = textContent
  clientNotification.classList.remove('app-banner--hidden')
}

export { clientNotification }

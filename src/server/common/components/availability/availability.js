import { isFunction } from 'lodash'

import { clientNotification } from '~/src/client/common/helpers/client-notification'

const isLoading = 'app-loader--is-loading'
const isVisible = 'app-icon--visible'

const show = ($icon) => {
  $icon.classList.add(isVisible)
  $icon.setAttribute('tabindex', '-1')
  $icon.setAttribute('role', 'alert')
}
const hide = ($icon) => {
  $icon.classList.remove(isVisible)
  $icon.removeAttribute('tabindex')
  $icon.removeAttribute('role')
}

async function getAvailability(
  value,
  dataFetcher,
  $loader,
  $successIcon,
  $failureIcon
) {
  const clearLoader = () => {
    clearTimeout(delayedLoader)
    $loader?.classList?.remove(isLoading)
  }

  const delayedLoader = setTimeout(() => {
    $loader.classList.add(isLoading)
  }, 200)

  try {
    const { isAvailable } = await dataFetcher(value)

    clearLoader()

    if (isAvailable) {
      show($successIcon)
      hide($failureIcon)
    } else {
      show($failureIcon)
      hide($successIcon)
    }
  } catch (error) {
    clientNotification(error.message)
    clearLoader()

    hide($successIcon)
    hide($failureIcon)
  }
}

function availability($input) {
  if (!$input) {
    return
  }

  const targetId = $input.getAttribute('data-availability-target-id')
  const $availability = document.querySelector(`[data-js="${targetId}"]`)
  const dataFetcherName = $availability.getAttribute('data-fetcher')
  const $loader = $availability.querySelector('[data-js="loader"]')
  const dataFetcher = window.cdp[dataFetcherName]

  if (!$availability || !isFunction(dataFetcher)) {
    return
  }

  const $successIcon = $availability.querySelector('[data-js="is-available"]')
  const $failureIcon = $availability.querySelector(
    '[data-js="is-not-available"]'
  )

  $input.addEventListener('blur', async (event) => {
    const value = event?.target?.value

    if (value) {
      await getAvailability(
        value,
        dataFetcher,
        $loader,
        $successIcon,
        $failureIcon
      )
    }
  })

  window.addEventListener('DOMContentLoaded', async () => {
    if ($input?.value) {
      await getAvailability(
        $input?.value,
        dataFetcher,
        $loader,
        $successIcon,
        $failureIcon
      )
    }
  })
}

export { availability }

import isFunction from 'lodash/isFunction.js'

import { clientNotification } from './client-notification.js'

function populateSelectOptions($controller) {
  if (!$controller) {
    return
  }

  const isLoadingClassName = 'app-loader--is-loading'
  const $target = document.querySelector(
    `[data-js*="${$controller.getAttribute('data-target')}"]`
  )
  const $loader = document.querySelector(
    `[data-js="${$controller.getAttribute('data-loader')}"]`
  )
  const dataFetcherName = $controller.getAttribute('data-fetcher')
  const dataFetcher = window.cdp[dataFetcherName]
  const dataFetcherArgs =
    $controller.getAttribute('data-fetcher-args')?.split(' ') ?? []

  if (!$target || !isFunction(dataFetcher)) {
    return
  }

  const defaultOption = new Option('', '')
  defaultOption.disabled = true
  defaultOption.selected = true
  defaultOption.value = ''
  defaultOption.text = ' - - select - - '

  $controller.addEventListener('change', async (event) => {
    const delayedLoader = setTimeout(() => {
      $loader.classList.add(isLoadingClassName)
    }, 200)

    const value = event?.target?.value

    // Remove all options from select element
    Array.from($target?.options).forEach((option) => option.remove())

    try {
      const options = await dataFetcher(value, ...dataFetcherArgs)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove(isLoadingClassName)

      const optionsWithPrependedBlank = [
        defaultOption,
        ...options.map((option) => new Option(option.text, option.value))
      ]

      optionsWithPrependedBlank.forEach((option) => $target.add(option))
    } catch (error) {
      clientNotification(error.message)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove(isLoadingClassName)
    }
  })
}

export { populateSelectOptions }

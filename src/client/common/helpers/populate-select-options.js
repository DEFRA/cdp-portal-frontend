import { isFunction } from 'lodash'

function populateSelectOptions($controller) {
  if (!$controller) {
    return
  }

  const $target = document.querySelector(
    `[data-js="${$controller.getAttribute('data-target')}"]`
  )
  const $loader = document.querySelector(
    `[data-js="${$controller.getAttribute('data-loader')}"]`
  )
  const dataFetcherName = $controller.getAttribute('data-fetcher')
  const dataFetcher = window[dataFetcherName]

  if (!$target || !isFunction(dataFetcher)) {
    return
  }

  const blankOption = new Option('', '')
  blankOption.hidden = true

  $controller.addEventListener('change', async (event) => {
    const delayedLoader = setTimeout(() => {
      $loader.classList.add('app-loader--is-loading')
    }, 200)

    const value = event?.target?.value

    // Remove all options from select element
    Array.from($target?.options).forEach((option) => option.remove())

    try {
      const options = await dataFetcher(value)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove('app-loader--is-loading')

      const optionsWithPrependedBlank = [
        blankOption,
        ...options.map((option) => new Option(option.text, option.value))
      ]

      optionsWithPrependedBlank.forEach((option) => $target.add(option))
    } catch (error) {
      const clientNotification = document.querySelector(
        '[data-js="app-client-notifications"]'
      )
      const clientMessageHolder = clientNotification.querySelector(
        '.app-banner__content'
      )

      clientMessageHolder.textContent = error.message
      clientNotification.classList.remove('app-banner--hidden')

      clearTimeout(delayedLoader)
      $loader?.classList?.remove('app-loader--is-loading')
    }
  })
}

export { populateSelectOptions }

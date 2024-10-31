import isFunction from 'lodash/isFunction.js'

import { clientNotification } from '~/src/client/common/helpers/client-notification.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { publish } from '~/src/client/common/helpers/event-emitter.js'

function populateAutocompleteSuggestions($controller) {
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
  const publishTo = $controller.getAttribute('data-publish-to')

  const dataFetcher = window.cdp[dataFetcherName]

  if (!$target || !isFunction(dataFetcher)) {
    return
  }

  $controller.addEventListener('change', async (event) => {
    const delayedLoader = setTimeout(() => {
      $loader.classList.add(isLoadingClassName)
    }, 200)

    const name = event?.target?.name
    const value = event?.target?.value

    try {
      const suggestions = await dataFetcher(value)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove(isLoadingClassName)

      const suggestionsName = $target.id

      window.cdp.suggestions[suggestionsName] = buildSuggestions(suggestions)

      if (publishTo) {
        publish(publishTo, { queryParams: { [name]: value } })
      }
    } catch (error) {
      clientNotification(error.message)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove(isLoadingClassName)
    }
  })
}

export { populateAutocompleteSuggestions }

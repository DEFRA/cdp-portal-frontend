import { isFunction } from 'lodash'

import { clientNotification } from '~/src/client/common/helpers/client-notification'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions'
import { publish } from '~/src/client/common/helpers/event-emitter'

function populateAutocompleteSuggestions($controller) {
  if (!$controller) {
    return
  }

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
      $loader.classList.add('app-loader--is-loading')
    }, 200)

    const name = event?.target?.name
    const value = event?.target?.value

    try {
      const suggestions = await dataFetcher(value)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove('app-loader--is-loading')

      const suggestionsName = $target.name

      window.suggestions[suggestionsName] = buildSuggestions(suggestions)

      if (publishTo) {
        publish(publishTo, { queryParams: { [name]: value } })
      }
    } catch (error) {
      clientNotification(error.message)

      clearTimeout(delayedLoader)
      $loader?.classList?.remove('app-loader--is-loading')
    }
  })
}

export { populateAutocompleteSuggestions }

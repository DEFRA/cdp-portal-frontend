import qs from 'qs'
import { history } from '~/src/client/common/helpers/history.js'

function prependQueryParams($elem, params) {
  const hrefParts = $elem.href.split('?')
  const href = hrefParts.at(0)

  $elem.href = href + qs.stringify(params, { addQueryPrefix: true })
}

function tabs($module) {
  const params = qs.parse(location.search, { ignoreQueryPrefix: true })
  const $tabs = Array.from($module.querySelectorAll(`[data-js="app-tab"]`))

  document.addEventListener('DOMContentLoaded', () => {
    $tabs.forEach(($tab) => prependQueryParams($tab, params))
  })

  history.listen(({ location }) => {
    const destinationParams = qs.parse(location.search, {
      ignoreQueryPrefix: true
    })

    $tabs.forEach(($tab) => prependQueryParams($tab, destinationParams))
  })
}

export { tabs }

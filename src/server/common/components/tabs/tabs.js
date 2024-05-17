import qs from 'qs'

function prependQueryParams($tab, params) {
  const hrefParts = $tab.href.split('?')
  const href = hrefParts.at(0)

  $tab.href = href + qs.stringify(params, { addQueryPrefix: true })
}

function tabs($module) {
  const params = qs.parse(location.search, { ignoreQueryPrefix: true })
  const $tabs = Array.from($module.querySelectorAll(`[data-js="app-tab"]`))

  document.addEventListener('DOMContentLoaded', () => {
    $tabs.forEach(($tab) => prependQueryParams($tab, params))
  })

  window.navigation.addEventListener('navigate', (event) => {
    const searchString = event.destination.url.split('?').at(1)
    const destinationParams = qs.parse(searchString, {
      ignoreQueryPrefix: true
    })

    $tabs.forEach(($tab) => prependQueryParams($tab, destinationParams))
  })
}

export { tabs }

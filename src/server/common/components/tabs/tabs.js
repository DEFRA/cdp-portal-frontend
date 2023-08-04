import qs from 'qs'
import { isEmpty } from 'lodash'

import { subscribe } from '~/src/client/common/helpers/event-emitter'
import { eventName } from '~/src/client/common/constants/event-name'

function prependQueryParams($tab, queryParamString) {
  const href = $tab.href.includes('?') ? $tab.href.split('?')[0] : $tab.href

  $tab.href = href + queryParamString
}

function tabs($module) {
  const queryParamString = location?.search
  const $tabs = Array.from($module.querySelectorAll(`[data-js="app-tab"]`))

  document.addEventListener('DOMContentLoaded', () => {
    $tabs.forEach(($tab) => prependQueryParams($tab, queryParamString))
  })

  subscribe(eventName.xhrUpdate, (event) => {
    const queryParamString = isEmpty(event.detail.params)
      ? ''
      : `?${qs.stringify(event.detail.params)}`

    $tabs.forEach(($tab) => prependQueryParams($tab, queryParamString))
  })
}

export { tabs }

import { initAll } from 'govuk-frontend'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { button } from '~/src/server/common/components/button/button'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { fetchVersions } from '~/src/client/common/helpers/fetch-versions'

import '../stylesheets/application.scss'

initAll()

window.fetchVersions = fetchVersions

const $readOutInputs = Array.from(
  document.querySelectorAll('[data-js="repository-name"]')
)

if ($readOutInputs.length) {
  $readOutInputs.forEach(($readOutInput) => readOut($readOutInput))
}

const $buttons = Array.from(document.querySelectorAll('[data-js="app-button"]'))

if ($buttons.length) {
  $buttons.forEach(($button) => button($button))
}

const $selectControllers = Array.from(
  document.querySelectorAll('[data-js="select-controller"]')
)

if ($selectControllers.length) {
  $selectControllers.forEach(($selectController) =>
    populateSelectOptions($selectController)
  )
}

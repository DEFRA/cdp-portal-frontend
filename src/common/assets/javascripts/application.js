import { initAll } from 'govuk-frontend'
import { readOut } from '~/src/common/components/read-out/read-out'
import { button } from '~/src/common/components/button/button'
import { populateSelectOptions } from '~/src/common/helpers/populate-select-options'

import '../stylesheets/application.scss'

initAll()

const $readOuts = Array.from(
  document.querySelectorAll('[data-js="repository-name"]')
)

if ($readOuts.length) {
  $readOuts.forEach(($readOut) => readOut($readOut))
}

const $buttons = Array.from(document.querySelectorAll('[data-js="app-button"]'))

if ($buttons.length) {
  $buttons.forEach(($button) => button($button))
}

const $selectControllers = Array.from(
  document.querySelectorAll('[data-js="deploy-version-controller"]')
)

if ($selectControllers.length) {
  $selectControllers.forEach(($selectController) =>
    populateSelectOptions($selectController)
  )
}

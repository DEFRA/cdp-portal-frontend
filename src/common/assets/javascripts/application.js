import { initAll } from 'govuk-frontend'
import { ReadOut } from '~/src/common/components/read-out/read-out'
import { Button } from '~/src/common/components/button/button'

import '../stylesheets/application.scss'

initAll()

// TODO handle multiples
const $readOut = document.querySelector('[data-js="repository-name"]')

if ($readOut) {
  ReadOut($readOut)
}

// TODO handle multiples
const $button = document.querySelector('[data-js="app-button"]')

if ($button) {
  Button($button)
}

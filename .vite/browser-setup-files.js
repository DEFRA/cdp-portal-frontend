import { locators } from 'vitest/browser'

import '../test-helpers/vitest-browser-html-renderer.js'
import '../src/client/javascripts/application.js'
import '../src/client/stylesheets/application.scss'

document.body.classList =
  'govuk-template__body js-enabled govuk-frontend-supported'

locators.extend({
  getById(id) {
    return `#${id}`
  }
})

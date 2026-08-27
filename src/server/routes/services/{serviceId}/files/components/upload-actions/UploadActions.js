import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

import 'govuk-frontend/dist/govuk/components/button/macro.njk'
import 'govuk-frontend/dist/govuk/components/button/template.njk'
import 'govuk-frontend/dist/govuk/macros/attributes.njk'

import '#server/common/components/tag/macro.njk'
import '#server/common/components/tag/template.njk'
import '#server/common/components/loader/macro.njk'
import '#server/common/components/loader/template.njk'

import 'govuk-frontend/dist/govuk/components/tag/macro.njk'
import 'govuk-frontend/dist/govuk/components/tag/template.njk'

export default class UploadActions extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-status']
  }

  constructor() {
    super(template)
  }
}

window.customElements.define('upload-actions', UploadActions)

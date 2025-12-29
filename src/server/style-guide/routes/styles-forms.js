import { scopes } from '@defra/cdp-validation-kit'

/**
 * Form element styles available in CDP
 */
const formStyles = {
  inputs: [
    {
      class: 'app-input',
      description: 'Base input with rounded corners',
      example:
        '<input class="govuk-input app-input" type="text" placeholder="Enter text">'
    },
    {
      class: 'app-input--wide',
      description: 'Wide input (24em)',
      example:
        '<input class="govuk-input app-input app-input--wide" type="text" placeholder="Wide input">'
    }
  ],
  labels: [
    {
      class: 'app-label',
      description: 'Bold label styling',
      example: '<label class="govuk-label app-label">Field label</label>'
    },
    {
      class: 'app-label--small',
      description: 'Smaller label variant',
      example:
        '<label class="govuk-label app-label app-label--small">Small label</label>'
    },
    {
      class: 'app-label--inline',
      description: 'Inline label for horizontal layouts',
      example:
        '<label class="govuk-label app-label app-label--inline">Inline label</label>'
    }
  ],
  hints: [
    {
      class: 'app-hint',
      description: 'Hint text with adjusted spacing',
      example:
        '<div class="govuk-hint app-hint">This is helpful hint text</div>'
    }
  ],
  textareas: [
    {
      class: 'app-textarea',
      description: 'Base textarea styling',
      example:
        '<textarea class="govuk-textarea app-textarea" rows="3" placeholder="Enter text"></textarea>'
    },
    {
      class: 'app-textarea--wide',
      description: 'Wide textarea (24em)',
      example:
        '<textarea class="govuk-textarea app-textarea app-textarea--wide" rows="3"></textarea>'
    },
    {
      class: 'app-textarea--extra-wide',
      description: 'Extra wide textarea (36em, 18em height)',
      example:
        '<textarea class="govuk-textarea app-textarea app-textarea--extra-wide" rows="5"></textarea>'
    }
  ],
  formGroups: [
    {
      class: 'app-form-group',
      description: 'Form group container',
      example: `<div class="govuk-form-group app-form-group">
  <label class="govuk-label app-label">Label</label>
  <input class="govuk-input app-input" type="text">
</div>`
    },
    {
      class: 'app-form-group--slim',
      description: 'Reduced margin form group',
      example: `<div class="govuk-form-group app-form-group app-form-group--slim">
  <label class="govuk-label app-label--small">Compact field</label>
  <input class="govuk-input app-input" type="text">
</div>`
    }
  ]
}

const stylesFormsRoute = {
  options: {
    id: 'style-guide/styles/forms',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/forms', {
      pageTitle: 'Form Elements - Styles - Style Guide',
      formStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Form Elements' }
      ]
    })
  }
}

export { stylesFormsRoute, formStyles }

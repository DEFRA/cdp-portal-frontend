import { scopes } from '@defra/cdp-validation-kit'

/**
 * Button styles available in CDP
 */
const buttonStyles = [
  {
    class: 'app-button',
    description: 'Base CDP button with rounded corners and shadow',
    example:
      '<button class="govuk-button app-button" data-module="govuk-button">Base button</button>'
  },
  {
    class: 'app-button--small',
    description: 'Smaller button for compact spaces',
    example:
      '<button class="govuk-button app-button app-button--small" data-module="govuk-button">Small button</button>'
  },
  {
    class: 'app-button--primary',
    description: 'Green primary action button',
    example:
      '<button class="govuk-button app-button app-button--primary" data-module="govuk-button">Primary</button>'
  },
  {
    class: 'app-button--secondary',
    description: 'Purple secondary action button',
    example:
      '<button class="govuk-button app-button app-button--secondary" data-module="govuk-button">Secondary</button>'
  },
  {
    class: 'app-button--tertiary',
    description: 'Light grey tertiary button for less prominent actions',
    example:
      '<button class="govuk-button app-button app-button--tertiary" data-module="govuk-button">Tertiary</button>'
  },
  {
    class: 'app-button--significant',
    description: 'Blue button for significant actions',
    example:
      '<button class="govuk-button app-button app-button--significant" data-module="govuk-button">Significant</button>'
  },
  {
    class: 'app-button--destructive',
    description: 'Red button for destructive actions (delete, remove)',
    example:
      '<button class="govuk-button app-button app-button--destructive" data-module="govuk-button">Delete</button>'
  },
  {
    class: 'app-button--hover-destructive',
    description: 'Normal button that turns red on hover',
    example:
      '<button class="govuk-button app-button app-button--hover-destructive" data-module="govuk-button">Hover to delete</button>'
  }
]

const stylesButtonsRoute = {
  options: {
    id: 'style-guide/styles/buttons',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/buttons', {
      pageTitle: 'Buttons - Styles - Style Guide',
      buttonStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Buttons' }
      ]
    })
  }
}

export { stylesButtonsRoute, buttonStyles }

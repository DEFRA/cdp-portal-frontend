import { scopes } from '@defra/cdp-validation-kit'

/**
 * Link styles available in CDP
 */
const linkStyles = [
  {
    class: 'app-link',
    description: 'Base CDP link with brand colour',
    example: '<a class="govuk-link app-link" href="#">Example link</a>'
  },
  {
    class: 'app-link--underline',
    description: 'Link with permanent underline',
    example:
      '<a class="govuk-link app-link app-link--underline" href="#">Underlined link</a>'
  },
  {
    class: 'app-link--without-underline',
    description: 'Link with no underline (use sparingly)',
    example:
      '<a class="govuk-link app-link app-link--without-underline" href="#">No underline</a>'
  },
  {
    class: 'app-link--text-colour',
    description: 'Link that inherits text colour',
    example:
      '<a class="govuk-link app-link app-link--text-colour" href="#">Text colour link</a>'
  },
  {
    class: 'app-link--inverse',
    description: 'Light coloured link for dark backgrounds',
    example:
      '<a class="govuk-link app-link app-link--inverse" href="#">Inverse link</a>',
    inverse: true
  },
  {
    class: 'app-link--with-separator',
    description: 'Link with left border separator (for inline lists)',
    example:
      '<a class="govuk-link app-link app-link--with-separator" href="#">Separated link</a>'
  }
]

const stylesLinksRoute = {
  options: {
    id: 'style-guide/styles/links',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/links', {
      pageTitle: 'Links - Styles - Style Guide',
      linkStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Links' }
      ]
    })
  }
}

export { stylesLinksRoute, linkStyles }

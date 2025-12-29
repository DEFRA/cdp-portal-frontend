import { scopes } from '@defra/cdp-validation-kit'

/**
 * Style categories for the Styles overview page.
 */
const styleCategories = [
  {
    name: 'links',
    title: 'Links',
    description:
      'CDP link styles including underline variants and inverse colours',
    href: '/style-guide/styles/links'
  },
  {
    name: 'buttons',
    title: 'Buttons',
    description:
      'Button modifiers for primary, secondary, destructive and other actions',
    href: '/style-guide/styles/buttons'
  },
  {
    name: 'forms',
    title: 'Form elements',
    description: 'Styled inputs, labels, hints and form groups',
    href: '/style-guide/styles/forms'
  },
  {
    name: 'layout',
    title: 'Layout',
    description: 'Flexbox, CSS Grid and alignment utilities',
    href: '/style-guide/styles/layout'
  },
  {
    name: 'typography',
    title: 'Typography',
    description: 'Code blocks, inline code and markdown styling',
    href: '/style-guide/styles/typography'
  },
  {
    name: 'colours',
    title: 'Colours',
    description: 'CDP brand colours and background utilities',
    href: '/style-guide/styles/colours'
  }
]

const stylesRoute = {
  options: {
    id: 'style-guide/styles',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/styles', {
      pageTitle: 'Styles - Style Guide',
      styleCategories,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles' }
      ]
    })
  }
}

export { stylesRoute, styleCategories }

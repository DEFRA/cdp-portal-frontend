import { scopes } from '@defra/cdp-validation-kit'

/**
 * Colour styles available in CDP
 */
const colourStyles = {
  brand: [
    {
      variable: '$app-brand-background-colour',
      description: 'Brand background colour (85% tint)',
      cssClass: null
    },
    {
      variable: '$app-brand-background-colour-light',
      description: 'Light brand background (95% tint)',
      cssClass: null
    },
    {
      variable: '$app-brand-border-colour',
      description: 'Brand border colour (50% tint)',
      cssClass: null
    },
    {
      variable: '$app-brand-border-colour-light',
      description: 'Light brand border (80% tint)',
      cssClass: null
    }
  ]
}

const stylesColoursRoute = {
  options: {
    id: 'style-guide/styles/colours',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/colours', {
      pageTitle: 'Colours - Styles - Style Guide',
      colourStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Colours' }
      ]
    })
  }
}

export { stylesColoursRoute, colourStyles }

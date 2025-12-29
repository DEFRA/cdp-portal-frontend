import { scopes } from '@defra/cdp-validation-kit'

/**
 * SVG registry for the Style Guide SVGs page.
 * Lists larger SVG illustrations and graphics.
 */
const svgRegistry = [
  {
    name: 'home-page-hero',
    macro: 'appHomePageHero',
    title: 'Home Page Hero Image',
    description:
      'An illustration of a laptop displaying the CDP Portal create service flow. Used on the home page to visually represent the platform and the simplicity of creating a new service.',
    path: 'icons/home-page-hero/macro.njk',
    rawAssetUrl:
      'https://github.com/DEFRA/cdp-portal-frontend/blob/main/raw-assets/images/home-page-hero.sketch'
  }
]

const svgsRoute = {
  options: {
    id: 'style-guide/svgs',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/svgs', {
      pageTitle: 'SVGs - Style Guide',
      svgs: svgRegistry,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'SVGs' }
      ]
    })
  }
}

export { svgsRoute, svgRegistry }

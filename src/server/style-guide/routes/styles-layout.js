import { scopes } from '@defra/cdp-validation-kit'

/**
 * Layout styles available in CDP
 */
const layoutStyles = {
  flex: [
    {
      class: 'app-flex',
      description: 'Flexbox container (responsive - flex on desktop)',
      example: `<div class="app-flex">
  <div style="background: #f3f2f1; padding: 10px;">Item 1</div>
  <div style="background: #dee0e2; padding: 10px;">Item 2</div>
  <div style="background: #f3f2f1; padding: 10px;">Item 3</div>
</div>`
    },
    {
      class: 'app-flex-center',
      description: 'Centered flex container',
      example: `<div class="app-flex-center" style="height: 80px; background: #f3f2f1;">
  <div style="background: #dee0e2; padding: 10px;">Centered content</div>
</div>`
    },
    {
      class: 'app-flex__one / app-flex__two',
      description: 'Flex grow items (1:2 ratio)',
      example: `<div class="app-flex">
  <div class="app-flex__one" style="background: #f3f2f1; padding: 10px;">Flex 1</div>
  <div class="app-flex__two" style="background: #dee0e2; padding: 10px;">Flex 2 (double width)</div>
</div>`
    },
    {
      class: 'app-align-right',
      description: 'Right align using margin-left: auto',
      example: `<div class="app-flex">
  <div style="background: #f3f2f1; padding: 10px;">Left</div>
  <div class="app-align-right" style="background: #dee0e2; padding: 10px;">Right aligned</div>
</div>`
    }
  ],
  grid: [
    {
      class: 'app-grid',
      description: 'CSS Grid container (responsive)',
      example: `<div class="app-grid" style="gap: 10px;">
  <div style="background: #f3f2f1; padding: 10px;">Grid item 1</div>
  <div style="background: #dee0e2; padding: 10px;">Grid item 2</div>
</div>`
    },
    {
      class: 'app-grid--fluid',
      description: 'Auto-fit fluid grid (min 600px columns)',
      example: `<div class="app-grid--fluid" style="gap: 10px;">
  <div style="background: #f3f2f1; padding: 10px;">Fluid item 1</div>
  <div style="background: #dee0e2; padding: 10px;">Fluid item 2</div>
  <div style="background: #f3f2f1; padding: 10px;">Fluid item 3</div>
</div>`
    }
  ],
  sections: [
    {
      class: 'app-section',
      description: 'Standard reading width section',
      example: `<div class="app-section" style="background: #f3f2f1; padding: 10px;">
  Content constrained to reading width
</div>`
    },
    {
      class: 'app-section--wide',
      description: 'Wider content section',
      example: `<div class="app-section--wide" style="background: #f3f2f1; padding: 10px;">
  Wider content area
</div>`
    },
    {
      class: 'app-section--extra-wide',
      description: 'Maximum width section',
      example: `<div class="app-section--extra-wide" style="background: #f3f2f1; padding: 10px;">
  Extra wide content area
</div>`
    }
  ],
  extended: [
    {
      class: 'govuk-grid-column-three-quarters-from-desktop-wide',
      description: 'Three-quarters width from wide desktop breakpoint',
      example: `<div class="govuk-grid-row">
  <div class="govuk-grid-column-three-quarters-from-desktop-wide" style="background: #f3f2f1; padding: 10px;">
    Three quarters from desktop wide
  </div>
</div>`
    },
    {
      class: 'govuk-grid-column-one-quarter-from-desktop-wide',
      description: 'One-quarter width from wide desktop breakpoint',
      example: `<div class="govuk-grid-row">
  <div class="govuk-grid-column-one-quarter-from-desktop-wide" style="background: #f3f2f1; padding: 10px;">
    One quarter from desktop wide
  </div>
</div>`
    }
  ]
}

const stylesLayoutRoute = {
  options: {
    id: 'style-guide/styles/layout',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/layout', {
      pageTitle: 'Layout - Styles - Style Guide',
      layoutStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Layout' }
      ]
    })
  }
}

export { stylesLayoutRoute, layoutStyles }

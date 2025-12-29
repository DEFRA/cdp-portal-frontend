import { scopes } from '@defra/cdp-validation-kit'

/**
 * Typography styles available in CDP
 */
const typographyStyles = {
  code: [
    {
      class: 'app-code',
      description: 'Code block with syntax highlighting background',
      example: '<pre class="app-code">const greeting = "Hello World";</pre>'
    },
    {
      class: 'app-code-inline',
      description: 'Inline code for use within text',
      example:
        '<p>Use the <code class="app-code-inline">app-link</code> class for links.</p>'
    }
  ],
  markdown: [
    {
      class: 'app-markdown',
      description: 'Wrapper for rendered markdown content',
      example: `<div class="app-markdown">
  <h2>Markdown Heading</h2>
  <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
  <ul>
    <li>List item one</li>
    <li>List item two</li>
  </ul>
</div>`
    }
  ],
  highlight: [
    {
      class: 'app-mark',
      description: 'Highlighted/marked text',
      example:
        '<p>This text has a <mark class="app-mark">highlighted section</mark> within it.</p>'
    }
  ]
}

const stylesTypographyRoute = {
  options: {
    id: 'style-guide/styles/typography',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/styles/typography', {
      pageTitle: 'Typography - Styles - Style Guide',
      typographyStyles,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Styles', href: '/style-guide/styles' },
        { text: 'Typography' }
      ]
    })
  }
}

export { stylesTypographyRoute, typographyStyles }

export const splitPaneStyleguide = {
  name: 'split-pane',
  title: 'Split Pane',
  description: 'Two-column layout with optional side navigation',
  category: 'layout',
  macro: {
    path: 'split-pane/macro.njk',
    name: 'appSplitPane'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Plain text content'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'HTML content'
    },
    {
      name: 'isWide',
      type: 'boolean',
      required: false,
      description: 'Use wider navigation pane'
    }
  ],
  examples: [
    {
      title: 'With side navigation',
      description:
        'Split pane with sub-navigation. The subNavigation context variable controls the side menu.',
      context: {
        subNavigation: [
          {
            isActive: true,
            url: '/services',
            label: { text: 'Services' }
          },
          {
            isActive: false,
            url: '/teams',
            label: { text: 'Teams' }
          },
          {
            isActive: false,
            url: '/test-suites',
            label: { text: 'Test Suites' }
          }
        ]
      },
      template: `{% from "split-pane/macro.njk" import appSplitPane with context %}

{% call appSplitPane({ isWide: true }) %}
  <h2 class="govuk-heading-l">Services</h2>
  <p>Services available on the Platform.</p>
{% endcall %}`
    }
  ]
}

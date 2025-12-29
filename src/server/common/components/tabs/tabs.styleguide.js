export const tabsStyleguide = {
  name: 'tabs',
  title: 'Tabs',
  description: 'Tab navigation with accessible panel switching',
  category: 'navigation',
  macro: {
    path: 'tabs/macro.njk',
    name: 'appTabs'
  },
  params: [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'ARIA label for tab list'
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      description:
        'Array of tab objects with label, url, isActive, panel.html, panel.text'
    },
    {
      name: 'displayTabs',
      type: 'boolean',
      required: false,
      description: 'Whether to display tabs (default: true)'
    }
  ],
  examples: [
    {
      title: 'With caller block content',
      template: `{% from "tabs/macro.njk" import appTabs %}

{% call appTabs({
  label: "Service views",
  tabs: [
    { label: "Overview", url: "/service/overview", isActive: true },
    { label: "Deployments", url: "/service/deployments" },
    { label: "Settings", url: "/service/settings" }
  ]
}) %}
<div class="govuk-!-margin-4">
  <p>Overview content goes here.</p>
</div>
{% endcall %}`
    },
    {
      title: 'With panel content in params',
      params: {
        label: 'Content sections',
        tabs: [
          {
            label: 'Summary',
            url: '/summary',
            isActive: true,
            panel: {
              html: '<div class="govuk-!-margin-4"><p>Summary content goes here.</p></div>'
            }
          },
          { label: 'Details', url: '/details' }
        ]
      }
    }
  ]
}

export const detailsStyleguide = {
  name: 'details',
  title: 'Details',
  description: 'Expandable details/summary component',
  category: 'layout',
  macro: {
    path: 'details/macro.njk',
    name: 'appDetails'
  },
  params: [
    {
      name: 'summaryText',
      type: 'string',
      required: false,
      description: 'Summary/toggle text'
    },
    {
      name: 'summaryHtml',
      type: 'string',
      required: false,
      description: 'Summary/toggle HTML'
    },
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'Expandable content text'
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'Expandable content HTML'
    },
    {
      name: 'id',
      type: 'string',
      required: false,
      description: 'Element ID'
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      description: 'Open by default'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Basic details',
      params: {
        summaryText: 'Show more information',
        html: '<p>Additional details go here.</p>'
      }
    },
    {
      isInverse: true,
      title: 'With caller block',
      template: `{% from "details/macro.njk" import appDetails %}

{% call appDetails({ summaryText: "View parameters" }) %}
  <ul class="govuk-list govuk-list--bullet">
    <li>Parameter 1: Required</li>
    <li>Parameter 2: Optional</li>
  </ul>
{% endcall %}`
    }
  ]
}

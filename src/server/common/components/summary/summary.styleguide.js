export const summaryStyleguide = {
  name: 'summary',
  title: 'Summary',
  description:
    'Summary card with icon, heading, intro text, and content section',
  category: 'layout',
  macro: {
    path: 'summary/macro.njk',
    name: 'appSummary'
  },
  params: [
    {
      name: 'icon',
      type: 'string',
      required: true,
      description: 'Icon HTML to display'
    },
    {
      name: 'heading',
      type: 'string',
      required: true,
      description: 'Card heading text'
    },
    {
      name: 'intro.text',
      type: 'string',
      required: false,
      description: 'Plain text intro'
    },
    {
      name: 'intro.html',
      type: 'string',
      required: false,
      description: 'HTML intro content'
    },
    {
      name: 'content.text',
      type: 'string',
      required: false,
      description: 'Plain text content'
    },
    {
      name: 'content.html',
      type: 'string',
      required: false,
      description: 'HTML content'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'With icon and intro',
      template: `{% from "summary/macro.njk" import appSummary %}
{% from "icons/instance-icon/macro.njk" import appInstanceIcon %}

{{ appSummary({
  icon: appInstanceIcon({ classes: "app-icon--small" }),
  heading: "Running Services",
  intro: { text: "View all running services across environments." }
}) }}`
    },
    {
      isInverse: true,
      title: 'With caller block',
      template: `{% from "summary/macro.njk" import appSummary %}
{% from "icons/block-icon/macro.njk" import appBlockIcon %}

{% call appSummary({
  icon: appBlockIcon({ classes: "app-icon--small" }),
  heading: "Services",
  intro: { text: "Manage your microservices." }
}) %}
  <ul class="govuk-list govuk-list--bullet">
    <li>12 services running</li>
    <li>3 pending deployments</li>
  </ul>
{% endcall %}`
    }
  ]
}

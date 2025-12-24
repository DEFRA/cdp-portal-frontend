export const filtersStyleguide = {
  name: 'filters',
  title: 'Filters',
  description: 'Filter form wrapper with clear all and auto-submit',
  category: 'form',
  macro: {
    path: 'filters/macro.njk',
    name: 'appFilters'
  },
  params: [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Form action URL'
    },
    {
      name: 'method',
      type: 'string',
      required: false,
      description: 'Form method (default: get)'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional form classes'
    },
    {
      name: 'fieldset.classes',
      type: 'string',
      required: false,
      description: 'Fieldset classes'
    },
    {
      name: 'clear.url',
      type: 'string',
      required: true,
      description: 'URL for "Clear all" link'
    },
    {
      name: 'info.html',
      type: 'string',
      required: false,
      description: 'Additional info HTML'
    },
    {
      name: 'hiddenInputs',
      type: 'object',
      required: false,
      description: 'Key-value pairs for hidden inputs'
    }
  ],
  examples: [
    {
      title: 'With select filters',
      template: `{% from "filters/macro.njk" import appFilters %}
{% from "select/macro.njk" import appSelect %}

{% call appFilters({
  action: "/services",
  clear: { url: "/services" }
}) %}
  <div class="govuk-form-group app-form-group app-form-group--inline">
    {{ appSelect({
      id: "team",
      classes: "app-select",
      name: "team",
      label: { text: "Team" },
      items: [
        { value: "", text: "All teams" },
        { value: "platform", text: "Platform" },
        { value: "frontend", text: "Frontend" }
      ],
      loader: { name: "team-loader" }
    }) }}
  </div>
{% endcall %}`
    }
  ]
}

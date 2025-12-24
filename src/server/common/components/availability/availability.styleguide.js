export const availabilityStyleguide = {
  name: 'availability',
  title: 'Availability',
  description:
    'Real-time name availability indicator. Used as suffix.html on govukInput.',
  category: 'form',
  macro: {
    path: 'availability/macro.njk',
    name: 'appAvailability'
  },
  params: [
    {
      name: 'targetId',
      type: 'string',
      required: true,
      description: 'ID of the input element to monitor'
    },
    {
      name: 'dataFetcher',
      type: 'string',
      required: true,
      description: 'URL for checking availability'
    }
  ],
  examples: [
    {
      title: 'With text input',
      description:
        'Type in the input below and tab/leave the input to do a name availability check.',
      template: `{% from "govuk/components/input/macro.njk" import govukInput %}
{% from "availability/macro.njk" import appAvailability %}

{{ govukInput({
  classes: "app-input app-input--wide",
  label: { text: "Service name" },
  id: "service-name",
  name: "serviceName",
  attributes: {
    "data-js": "app-availability",
    "data-availability-target-id": "service-name",
    "data-1p-ignore": ""
  },
  suffix: {
    classes: "app-input__suffix",
    html: appAvailability({
      targetId: "service-name",
      dataFetcher: "fetchIsNameAvailable"
    })
  }
}) }}`
    }
  ]
}

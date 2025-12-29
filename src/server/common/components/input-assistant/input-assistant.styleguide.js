export const inputAssistantStyleguide = {
  name: 'input-assistant',
  title: 'Input Assistant',
  description: 'Warning display for naming convention violations',
  category: 'form',
  macro: {
    path: 'input-assistant/macro.njk',
    name: 'appInputAssistant'
  },
  params: [
    {
      name: 'targetId',
      type: 'string',
      required: true,
      description: 'ID used for data-js targeting'
    },
    {
      name: 'message',
      type: 'string',
      required: true,
      description: 'Warning message template (via data-message)'
    }
  ],
  examples: [
    {
      title: 'Naming validation',
      description:
        "Type some 'bad names' into the input to see the warning. E.g. 'new', 'next', 'discovery', 'alpha', 'beta', 'repository', 'repo', 'main', 'master' or 'react'.",
      template: `{% from "govuk/components/input/macro.njk" import govukInput %}
{% from "input-assistant/macro.njk" import appInputAssistant %}

{{ govukInput({
  label: {
    text: "Name",
    classes: "app-label"
  },
  id: "name",
  name: "repositoryName",
  classes: "app-input",
  hint: {
    html: "Lowercase letters, numbers and hyphens. Maximum 32 characters. E.g. seed-vault-documentation",
        classes: "app-hint"
      },
  formGroup: {
    classes: "app-form-group app-form-group-js"
  },
  attributes: {
    "data-js": "app-input-assistant",
    "data-input-assistant-target-id": "name-input-assistant",
    "data-1p-ignore": ""
  }
}) }}

{{ appInputAssistant({
  message: "That name is not ideal. Read 'Naming conventions' for some tips",
  targetId: "name-input-assistant"
}) }}`
    }
  ]
}

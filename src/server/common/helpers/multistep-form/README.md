# Multistep-form plugin

- [Using the multistep form plugin](#using-the-multistep-form-plugin)
  - [Installation](#installation)
  - [Custom options](#custom-options)
  - [Saving data in your flow](#saving-data-in-your-flow)
  - [Providing form values and inline errors in your flow](#providing-form-values-and-inline-errors-in-your-flow)
  - [Check session is valid helper](#check-session-is-valid-helper)
  - [Example](#example)
    s

## Using the multistep form plugin

### Installation

In a route file register the multistep plugin with the following options:

```javascript
server.register({
  plugin: multistepForm,
  options: {
    urlTemplates,
    formSteps,
    routes: [
      {
        method: 'GET',
        path: '/deploy-service',
        ...startDeployServiceController
      },
      {
        method: 'GET',
        path: '/deploy-service/details/{multiStepFormId?}',
        ...detailsFormController
      }
    ]
  }
})
```

### Custom options

Provide the following custom options `formSteps` and `urlTemplates` for you flow. These control the steps in your flow
and the completion of the steps. Everything else is taken care for you.

```javascript
/** @type {Record<string, string>} */
const urlTemplates = {
  stepOne: '/deploy-service/details/{multiStepFormId?}',
  stepTwo: '/deploy-service/options/{multiStepFormId}',
  stepThree: '/deploy-service/summary/{multiStepFormId}'
}

/**
 * Returns the objects that control the form steps
 * @param {string} path
 * @param {Record<string, boolean>} params
 * @param {StepData | null} stepData
 * @param {Function} isMultistepComplete
 * @returns {Array<FormStep>}
 */
function formSteps({
  path,
  params,
  stepData = null,
  isMultistepComplete = () => ({})
}) {
  const isComplete = isMultistepComplete(stepData)

  const stepOneUrl = populatePathParams(params, urlTemplates.stepOne)
  const stepTwoUrl = populatePathParams(params, urlTemplates.stepTwo)
  const stepThreeUrl = populatePathParams(params, urlTemplates.stepThree)

  return [
    {
      url: stepOneUrl,
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(stepOneUrl),
      text: 'Details'
    },
    {
      url: stepTwoUrl,
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(stepTwoUrl),
      text: 'Options'
    },
    {
      isComplete: isComplete.stepThree,
      isCurrent: path.endsWith(stepThreeUrl),
      text: 'Summary'
    }
  ]
}
```

### Saving data in your flow

In your flows `POST` controllers, use `await request.app.saveStepData(multiStepFormId, payload, h)` to save the step
data.

### Providing form values and inline errors in your flow

You have `formValues` and `formErrors` available in context. These values are used to populate the form fields and
error messages in your multistep-form flows views.

### Example

For a working example see the `deploy-service` flow.

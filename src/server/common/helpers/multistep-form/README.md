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
    urls,
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

Provide the following custom options `formSteps` and `urls` for you flow. These control the steps in your flow and the
completion of the steps. Everything else is taken care for you.

```javascript
const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary'
}

function formSteps(path, multiStepFormId, stepData) {
  const isComplete = isMultistepComplete(stepData)
  const withId = (url) => `${url}/${multiStepFormId}`

  return [
    {
      url: withId(urls.stepOne),
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(urls.stepOne),
      text: 'Details'
    },
    {
      url: withId(urls.stepTwo),
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(withId(urls.stepTwo)),
      text: 'Options'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.endsWith(withId(urls.stepThree)),
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

### Check session is valid helper

To bounce users to the start of a multistep-form flow if the session is invalid, use the `checkSessionIsValid`
helper in a routes `options`.

```javascript
options: {
  ext: {
    onPreHandler: checkSessionIsValid('/deploy-service')
  }
}
```

### Example

For a working example see the `deploy-service` flow.

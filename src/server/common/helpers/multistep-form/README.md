# Multistep plugin

- [Using the multistep form plugin](#using-the-multistep-form-plugin)
  - [Installation](#installation)
  - [Custom options](#custom-options)
  - [Saving data in your flow](#saving-data-in-your-flow)
  - [Example](#example)

## Using the multistep form plugin

### Installation

In a route file register the multistep plugin with the following options:

```javascript
server.register({
  plugin: multistepForm,
  options: {
    formSteps,
    isMultistepComplete,
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
      },
      {
        method: 'POST',
        path: '/deploy-service/details/{multiStepFormId?}',
        ...detailsController
      },
      {
        method: 'GET',
        path: '/deploy-service/options/{multiStepFormId}',
        ...optionsFormController
      },
      {
        method: 'POST',
        path: '/deploy-service/options/{multiStepFormId}',
        ...optionsController
      },
      {
        method: 'GET',
        path: '/deploy-service/summary/{multiStepFormId}',
        ...summaryController
      },
      {
        method: 'POST',
        path: '/deploy-service/deploy/{multiStepFormId}',
        ...deployController
      }
    ].map(serviceTeamAndAdminUserScope)
  }
})
```

### Custom options

Provide the following custom options `formSteps` and `isMultistepComplete` for you flow:

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

function getStepByPath(path) {
  const result = Object.entries(urls).find(([, url]) => path.startsWith(url))
  return result.at(0)
}

function isMultistepComplete(stepData) {
  return {
    stepOne: stepData?.isComplete?.stepOne,
    stepTwo: stepData?.isComplete?.stepTwo,
    stepThree: stepData?.isComplete?.allSteps
  }
}
```

### Saving data in your flow

In your flow use `await request.saveStepData(multiStepFormId, payload, h, getStepByPath)` to save the step data.
Pass in your flows `getStepByPath` function to get the current step.

### Example

For a working example see the `deploy-service` flow.

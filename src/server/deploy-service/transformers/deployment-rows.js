import qs from 'qs'

function buildRow(multiStepDataSessionId) {
  return (text, value, stepPath, hideActions = false) => {
    const queryString = qs.stringify(
      {
        redirectLocation: 'summary'
      },
      { addQueryPrefix: true }
    )

    return {
      key: { text, classes: 'app-summary__heading' },
      value: { html: value },
      ...(!hideActions && {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              href: `/deploy-service/${stepPath}/${multiStepDataSessionId}${queryString}`,
              text: 'Change',
              classes: 'app-link',
              visuallyHiddenText: text
            }
          ]
        }
      })
    }
  }
}

function deploymentRows(
  details,
  cpuDetail,
  memoryDetail,
  multiStepDataSessionId
) {
  const row = buildRow(multiStepDataSessionId)
  const hideActions = details.isPrototype

  return [
    row('Image name', details.imageName, 'details'),
    row('Image version', details.version, 'details'),
    row('Environment', details.environment, 'details'),
    row('Instance count', details.instanceCount, 'options', hideActions),
    row('CPU size', cpuDetail?.text, 'options'),
    row('Memory allocation', memoryDetail?.text, 'options')
  ]
}

export { deploymentRows }

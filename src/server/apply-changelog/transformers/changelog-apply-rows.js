import qs from 'qs'

function buildRow(multiStepDataSessionId) {
  return (text, value, stepPath) => {
    const queryString = qs.stringify(
      {
        redirectLocation: 'summary'
      },
      { addQueryPrefix: true }
    )

    return {
      key: { text, classes: 'app-summary__heading' },
      value: { html: value },
      actions: {
        classes: 'app-summary__action',
        items: [
          {
            href: `/apply-changelog/${stepPath}/${multiStepDataSessionId}${queryString}`,
            text: 'Change',
            classes: 'app-link',
            visuallyHiddenText: text
          }
        ]
      }
    }
  }
}

function changelogApplyRows(details, multiStepDataSessionId) {
  const row = buildRow(multiStepDataSessionId)
  const changeDetailsPath = 'change-details'

  return [
    row('Microservice name', details.serviceName, changeDetailsPath),
    row('Changelog version', details.version, changeDetailsPath),
    row('Environment', details.environment, changeDetailsPath)
  ]
}

export { changelogApplyRows }

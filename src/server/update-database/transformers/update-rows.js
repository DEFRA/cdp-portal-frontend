import qs from 'qs'
import startCase from 'lodash/startCase.js'

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
            href: `/update-database/${stepPath}/${multiStepDataSessionId}${queryString}`,
            text: 'Change',
            classes: 'app-link',
            visuallyHiddenText: text
          }
        ]
      }
    }
  }
}

function updateRows(details, multiStepDataSessionId) {
  const row = buildRow(multiStepDataSessionId)
  const changeDetailsPath = 'change-details'

  return [
    row('Service name', details.serviceName, changeDetailsPath),
    row('Version', details.version, changeDetailsPath),
    row('Environment', startCase(details.environment), changeDetailsPath)
  ]
}

export { updateRows }

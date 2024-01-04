import { isNull, startCase } from 'lodash'

import { noValue } from '~/src/server/common/constants/no-value'

function buildRow(name, value, stepPath) {
  const href = `/create/${stepPath}?redirectLocation=summary`

  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: { html: value },
    ...(stepPath && {
      actions: {
        classes: 'app-summary__action',
        items: [
          {
            href,
            text: 'Change',
            classes: 'app-link',
            visuallyHiddenText: name
          }
        ]
      }
    })
  }
}

function summaryTestsRows(create) {
  const detailPage = 'tests-detail'
  const createDetails = Object.entries(create).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})

  return [
    buildRow('Creation Type', startCase(createDetails.kind), 'choose-kind'),
    buildRow('Repository Name', createDetails.repositoryName, detailPage),
    buildRow('Owning Team', createDetails.teamName, detailPage)
  ]
}

export { summaryTestsRows }

import startCase from 'lodash/startCase.js'
import isNull from 'lodash/isNull.js'

import { noValue } from '~/src/server/common/constants/no-value.js'

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

function summaryTestSuiteRows(create, suiteType, isAdmin) {
  const detailPage = suiteType + '/detail'
  const createDetails = Object.entries(create).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})

  const rows = [
    buildRow('Kind', startCase(createDetails.kind), 'choose-kind'),
    buildRow('Name', createDetails.repositoryName, detailPage),
    buildRow('Owning Team', createDetails.teamName, detailPage)
  ]

  if (isAdmin) {
    rows.push(buildRow('Template tag', createDetails.templateTag, detailPage))
  }

  return rows
}

export { summaryTestSuiteRows }

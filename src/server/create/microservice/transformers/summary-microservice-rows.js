import startCase from 'lodash/startCase.js'
import isNull from 'lodash/isNull.js'

import { noValue } from '~/src/server/common/constants/no-value.js'

function buildRow(name, value, stepPath) {
  const href = `/create/${stepPath}?redirectLocation=summary`

  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: {
      html: `<span data-testid='row-${name.replaceAll(/\s/g, '')}'>${value}</span>`
    },
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

function summaryMicroserviceRows(create, isAdmin) {
  const detailPage = 'microservice/detail'
  const createDetails = Object.entries(create).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})

  const rows = [
    buildRow('Kind', startCase(createDetails.kind), 'choose-kind'),
    buildRow('Name', createDetails.microserviceName, detailPage),
    buildRow('Template', createDetails.serviceTypeName, detailPage)
  ]

  if (isAdmin) {
    rows.push(buildRow('Template tag', createDetails.templateTag, detailPage))
  }

  rows.push(buildRow('Owning Team', createDetails.teamName, detailPage))

  return rows
}

export { summaryMicroserviceRows }

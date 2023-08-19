import { isNull } from 'lodash'

import { appConfig } from '~/src/config'
import { noValue } from '~/src/server/common/constants/no-value'

function buildRow(name, value, stepPath, query) {
  const queryString = value !== noValue && query ? `&${query}=${value}` : ''

  const href =
    appConfig.get('appPathPrefix') +
    `/admin/users/create/${stepPath}?redirectLocation=summary` +
    queryString

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

async function transformSummaryUserRows(details) {
  const detailsWithNoValues = Object.entries(details).reduce(
    (obj, [key, value]) => {
      return {
        ...obj,
        [key]: isNull(value) ? noValue : value
      }
    },
    {}
  )

  return [
    buildRow(
      'AAD user',
      detailsWithNoValues.email,
      'find-aad-user',
      'emailSearch'
    ),
    buildRow(
      'GitHub user',
      detailsWithNoValues.github,
      'find-github-user',
      'githubSearch'
    ),
    buildRow('CDP user name', detailsWithNoValues.name, 'user-details'),
    buildRow('Defra AWS ID', detailsWithNoValues.defraAwsId, 'user-details'),
    buildRow('Defra VPN ID', detailsWithNoValues.defraVpnId, 'user-details')
  ]
}

export { transformSummaryUserRows }

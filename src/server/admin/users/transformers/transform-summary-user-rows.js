import { isNull } from 'lodash'

import { noValue } from '~/src/server/common/constants/no-value'
import { buildLink } from '~/src/server/common/helpers/build-link'

function buildRow(name, value, stepPath, query, queryValue = value) {
  const queryString =
    value !== noValue && query ? `&${query}=${queryValue}` : ''

  const href = `/admin/users/${stepPath}?redirectLocation=summary` + queryString
  const withTestIdWrapper = (value) => {
    if (value) {
      return `<span data-testid="${name.toLowerCase().replace(/\s+/g, '-')}">${value}</span>`
    }
  }

  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: {
      html: withTestIdWrapper(value)
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

function transformSummaryUserRows(cdpUser) {
  const isEdit = cdpUser?.isEdit ?? false
  const userDetails = Object.entries(cdpUser).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})
  const githubUserUiValue = cdpUser.github
    ? buildLink(
        `https://github.com/${userDetails.github}`,
        `@${userDetails.github}`
      )
    : noValue

  return [
    isEdit
      ? buildRow('AAD user email', userDetails.email)
      : buildRow(
          'AAD user email',
          userDetails.email,
          'find-aad-user',
          'aadQuery'
        ),
    buildRow('AAD user name', userDetails.name),
    buildRow(
      'GitHub user',
      githubUserUiValue,
      'find-github-user',
      'githubSearch',
      userDetails.github
    ),
    buildRow('Defra AWS ID', userDetails.defraAwsId, 'user-details'),
    buildRow('Defra VPN ID', userDetails.defraVpnId, 'user-details')
  ]
}

export { transformSummaryUserRows }

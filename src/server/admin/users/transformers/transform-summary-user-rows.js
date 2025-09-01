import isNull from 'lodash/isNull.js'

import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

function buildRow(name, value, stepPath, query, queryValue = value) {
  const queryString =
    value !== noValue && query ? `&${query}=${queryValue}` : ''

  const href = `/admin/users/${stepPath}?redirectLocation=summary` + queryString
  const withTestIdWrapper = (text) => {
    if (text) {
      return `<span data-testid="${name.toLowerCase().replace(/\s+/g, '-')}">${text}</span>`
    }

    return null
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
    ? buildLink({
        href: `https://github.com/${userDetails.github}`,
        text: `@${userDetails.github}`
      })
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
    )
  ]
}

export { transformSummaryUserRows }

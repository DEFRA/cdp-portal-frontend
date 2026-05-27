import isNull from 'lodash/isNull.js'

import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

function buildRow(name, value, stepPath) {
  const href = `/admin/users/${stepPath}?redirectLocation=summary`
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
    actions: {
      classes: 'app-summary__action',
      items: [
        stepPath
          ? {
              href,
              text: 'Change',
              classes: 'app-link',
              visuallyHiddenText: name
            }
          : {}
      ]
    }
  }
}

function transformSummaryUserRows(cdpUser) {
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
    buildRow('AAD user email', userDetails.email, 'find-aad-user'),
    buildRow('AAD user name', userDetails.name),
    buildRow('GitHub user', githubUserUiValue, 'find-github-user')
  ]
}

export { transformSummaryUserRows }

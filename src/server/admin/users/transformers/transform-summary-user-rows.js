import { isNull } from 'lodash'

import { config } from '~/src/config'
import { noValue } from '~/src/server/common/constants/no-value'
import { buildLink } from '~/src/server/common/helpers/build-link'

function buildRow(name, value, stepPath, query, queryValue = value) {
  const queryString =
    value !== noValue && query ? `&${query}=${queryValue}` : ''

  const href =
    config.get('appPathPrefix') +
    `/admin/users/${stepPath}?redirectLocation=summary` +
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

function transformSummaryUserRows(cdpUser) {
  const githubOrg = config.get('githubOrg')
  const isEdit = cdpUser?.isEdit ?? false
  const userDetails = Object.entries(cdpUser).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})
  const githubUserUiValue = cdpUser.github
    ? buildLink(
        `https://github.com/orgs/${githubOrg}/people/${userDetails.github}`,
        `@${userDetails.github}`
      )
    : noValue

  return [
    isEdit
      ? buildRow('AAD user', userDetails.email)
      : buildRow('AAD user', userDetails.email, 'find-aad-user', 'aadQuery'),
    buildRow(
      'Github user',
      githubUserUiValue,
      'find-github-user',
      'githubSearch',
      userDetails.github
    ),
    buildRow('CDP user name', userDetails.name, 'user-details'),
    buildRow('Defra AWS ID', userDetails.defraAwsId, 'user-details'),
    buildRow('Defra VPN ID', userDetails.defraVpnId, 'user-details')
  ]
}

export { transformSummaryUserRows }

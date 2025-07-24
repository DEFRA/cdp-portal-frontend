import isNull from 'lodash/isNull.js'

import { config } from '../../../../config/config.js'
import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

function buildRow(name, value, stepPath, query, queryValue = value) {
  const queryString =
    value !== noValue && query ? `&${query}=${queryValue}` : ''

  const href = `/admin/teams/${stepPath}?redirectLocation=summary` + queryString

  const withTestIdWrapper = (text) => {
    if (text) {
      return `<span data-testid="${name.toLowerCase().replace(/\s+/g, '-')}">${text}</span>`
    }

    return null
  }

  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: { html: withTestIdWrapper(value) },
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

function transformSummaryTeamRows(cdpTeam) {
  const githubOrg = config.get('githubOrg')
  const teamDetails = Object.entries(cdpTeam).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: isNull(value) ? noValue : value
    }
  }, {})
  const teamDetailsPath = 'team-details'
  const githubTeamUiValue = cdpTeam.github
    ? buildLink({
        href: `https://github.com/orgs/${githubOrg}/teams/${teamDetails.github}`,
        text: `@${teamDetails.github}`
      })
    : noValue

  return [
    buildRow('Name', teamDetails.name, teamDetailsPath),
    buildRow('Description', teamDetails.description, teamDetailsPath),
    buildRow(
      'GitHub team',
      githubTeamUiValue,
      'find-github-team',
      'githubSearch',
      teamDetails.github
    ),
    buildRow('Service Code', teamDetails.serviceCode, teamDetailsPath),
    buildRow(
      'Alert Emails',
      teamDetails.alertEmailAddresses?.join('<br>'),
      teamDetailsPath
    ),
    buildRow(
      'Alert Environments',
      teamDetails.alertEnvironments?.join(', '),
      teamDetailsPath
    )
  ]
}

export { transformSummaryTeamRows }

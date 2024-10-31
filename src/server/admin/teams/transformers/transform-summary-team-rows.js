import isNull from 'lodash/isNull.js'

import { config } from '~/src/config/index.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/build-link.js'

function buildRow(name, value, stepPath, query, queryValue = value) {
  const queryString =
    value !== noValue && query ? `&${query}=${queryValue}` : ''

  const href = `/admin/teams/${stepPath}?redirectLocation=summary` + queryString

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
    ? buildLink(
        `https://github.com/orgs/${githubOrg}/teams/${teamDetails.github}`,
        `@${teamDetails.github}`
      )
    : noValue

  return [
    buildRow('Name', teamDetails.name, teamDetailsPath),
    buildRow('Description', teamDetails.description, teamDetailsPath),
    buildRow('Service Code', teamDetails.serviceCode, teamDetailsPath),
    buildRow(
      'GitHub team',
      githubTeamUiValue,
      'find-github-team',
      'githubSearch',
      teamDetails.github
    )
  ]
}

export { transformSummaryTeamRows }

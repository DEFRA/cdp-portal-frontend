import { isNull } from 'lodash'

import { config } from '~/src/config'
import { noValue } from '~/src/server/common/constants/no-value'
import { buildLink } from '~/src/server/common/helpers/build-link'

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
  const githubTeamUiValue = cdpTeam.github
    ? buildLink(
        `https://github.com/orgs/${githubOrg}/teams/${teamDetails.github}`,
        `@${teamDetails.github}`
      )
    : noValue

  return [
    buildRow('Name', teamDetails.name, 'team-details'),
    buildRow('Description', teamDetails.description, 'team-details'),
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

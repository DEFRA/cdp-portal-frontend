import isNull from 'lodash/isNull.js'

import { config } from '../../../../config/config.js'
import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

function buildRow(name, value, stepPath, multiStepFormId) {
  const href = `/admin/teams/${stepPath}/${multiStepFormId}?redirectLocation=summary`
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

function transformSummaryTeamRows(cdpTeam, multiStepFormId) {
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
    buildRow('Name', teamDetails.name, teamDetailsPath, multiStepFormId),
    buildRow(
      'Description',
      teamDetails.description,
      teamDetailsPath,
      multiStepFormId
    ),
    buildRow(
      'GitHub team',
      githubTeamUiValue,
      'find-github-team',
      multiStepFormId
    ),
    buildRow(
      'Service Code',
      teamDetails.serviceCode,
      teamDetailsPath,
      multiStepFormId
    ),
    buildRow(
      'Alert Emails',
      teamDetails.alertEmailAddresses?.join('<br>'),
      teamDetailsPath,
      multiStepFormId
    ),
    buildRow(
      'Alert Environments',
      teamDetails.alertEnvironments?.join(', '),
      teamDetailsPath,
      multiStepFormId
    )
  ]
}

export { transformSummaryTeamRows }

import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/build-link.js'
import { config } from '~/src/config/config.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'

const editActionItems = (teamId) => ({
  classes: 'govuk-!-padding-right-1',
  items: [
    {
      classes: 'app-link app-link--underline',
      href: `/teams/${teamId}/edit`,
      text: 'Edit',
      visuallyHiddenText: 'Edit team',
      attributes: { 'data-testid': 'edit-link' }
    }
  ]
})

function transformTeamToSummary(team, withActions = false) {
  const editActions = editActionItems(team.teamId)
  const githubOrg = config.get('githubOrg')
  const actions = withActions ? editActions : null

  return {
    classes: 'app-summary-list',
    attributes: { 'data-testid': 'govuk-summary-list' },
    rows: [
      {
        key: { text: 'Name' },
        value: { text: team.name }
      },
      {
        key: { text: 'Description' },
        value: { text: team.description || noValue },
        actions
      },
      {
        key: { text: 'Members' },
        value: { text: team.users.length }
      },
      {
        key: { text: 'GitHub team' },
        value: {
          html: team.github
            ? buildLink(
                `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
                `@${team.github}`
              )
            : noValue
        }
      },
      {
        key: { text: 'Service Codes' },
        value: {
          html: team.serviceCodes?.length
            ? buildList(team.serviceCodes)
            : noValue
        }
      },
      {
        key: { text: 'Alert Emails' },
        value: {
          html: team.alertEmailAddresses?.length
            ? buildList(
                team.alertEmailAddresses.map((email) =>
                  buildLink(`mailto:${email}`, email)
                )
              )
            : noValue
        }
      },
      {
        key: { text: 'Last Updated' },
        value: { html: renderComponent('time', { datetime: team.updatedAt }) }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: team.createdAt })
        }
      }
    ]
  }
}

export { transformTeamToSummary }

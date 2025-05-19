import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { config } from '~/src/config/config.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'

const editActionItems = (teamId) => ({
  items: [
    {
      classes: 'app-link app-link--underline',
      href: `/admin/teams/${teamId}/edit`,
      text: 'Edit',
      visuallyHiddenText: 'Edit team',
      attributes: { 'data-testid': 'edit-link' }
    }
  ]
})

function transformTeamToSummary(team, withActions = true) {
  const editActions = editActionItems(team.teamId)
  const githubOrg = config.get('githubOrg')
  const actions = withActions ? editActions : null

  return {
    classes: 'app-summary-list',
    attributes: { 'data-testid': 'govuk-summary-list' },
    rows: [
      {
        key: { text: 'Name' },
        value: { text: team.name },
        actions
      },
      {
        key: { text: 'Description' },
        value: { text: team.description || noValue },
        actions
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
        },
        actions
      },
      {
        key: { text: 'Service Codes' },
        value: {
          html: team.serviceCodes?.length
            ? buildList(team.serviceCodes)
            : noValue
        },
        actions
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
        },
        actions
      },
      {
        key: { text: 'Alert Environments' },
        value: {
          html: team.alertEnvironments?.length
            ? team.alertEnvironments.join(', ')
            : noValue
        },
        actions
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

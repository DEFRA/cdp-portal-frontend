import {
  renderComponent,
  renderIcon
} from '../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../common/constants/no-value.js'
import { buildLink } from '../../common/helpers/view/build-link.js'
import { config } from '../../../config/config.js'
import { buildList } from '../../common/helpers/view/build-list.js'

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

const buildMembers = (team, withActions) =>
  team.users.map((user, i) => {
    return {
      key: { text: i === 0 ? 'Members' : '' },
      value: {
        html: `<div class="app-!-layout-flex-start">${
          renderIcon('user-icon', {
            classes: 'app-icon--minuscule govuk-!-margin-right-1'
          }) + user.name
        }</div>`
      },
      actions: {
        items: withActions
          ? [
              {
                classes: 'app-link app-link--underline',
                href: `/teams/${team.teamId}/remove-member/${user.userId}`,
                text: 'Remove',
                visuallyHiddenText: 'Remove team member',
                attributes: { 'data-testid': 'remove-link' }
              }
            ]
          : []
      }
    }
  })

function transformTeamToSummary(team, withActions = false) {
  const editActions = editActionItems(team.teamId)
  const githubOrg = config.get('githubOrg')
  const actions = withActions ? editActions : null

  return {
    classes: 'app-summary-list',
    attributes: { 'data-testid': 'team-details' },
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
            ? buildLink({
                href: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
                text: `@${team.github}`
              })
            : noValue
        }
      },
      {
        key: { text: 'Service Codes' },
        value: {
          html: team.serviceCodes?.length
            ? buildList({ items: team.serviceCodes })
            : noValue
        }
      },
      {
        key: { text: 'Alert Emails' },
        value: {
          html: team.alertEmailAddresses?.length
            ? buildList({
                items: team.alertEmailAddresses.map((email) =>
                  buildLink({ href: `mailto:${email}`, text: email })
                )
              })
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
      },
      ...buildMembers(team, withActions)
    ]
  }
}

export { transformTeamToSummary }

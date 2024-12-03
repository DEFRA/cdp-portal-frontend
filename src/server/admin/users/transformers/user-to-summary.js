import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/build-link.js'

const editActionItems = (userId) => ({
  classes: 'govuk-!-padding-right-1',
  items: [
    {
      classes: 'app-link app-link--underline',
      href: `/admin/users/${userId}/edit`,
      text: 'Edit',
      visuallyHiddenText: 'Edit user'
    }
  ]
})

function transformUserToSummary(user, withActions = true) {
  const editActions = editActionItems(user.userId)
  const actions = withActions ? editActions : null

  return {
    classes: 'govuk-!-margin-bottom-8',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Name' },
        value: { text: user.name }
      },
      {
        key: { text: 'Email' },
        value: {
          html: user.email
            ? buildLink(`mailto:${user.email}`, user.email)
            : noValue
        }
      },
      {
        key: { text: 'GitHub user' },
        value: {
          html: user.github
            ? buildLink(`https://github.com/${user.github}`, `@${user.github}`)
            : noValue
        },
        actions
      },
      {
        key: { text: 'DEFRA Aws Id' },
        value: { text: user.defraAwsId ?? noValue },
        actions
      },
      {
        key: { text: 'DEFRA Vpn Id' },
        value: { text: user.defraVpnId ?? noValue },
        actions
      },
      {
        key: { text: 'Last Updated' },
        value: { html: renderComponent('time', { datetime: user.updatedAt }) }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: user.createdAt })
        }
      }
    ]
  }
}

export { transformUserToSummary }

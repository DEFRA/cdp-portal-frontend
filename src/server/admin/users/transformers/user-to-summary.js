import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

const editActionItems = (userId) => ({
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
    classes: 'app-summary-list',
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
            ? buildLink({ href: `mailto:${user.email}`, text: user.email })
            : noValue
        }
      },
      {
        key: { text: 'GitHub user' },
        value: {
          html: user.github
            ? buildLink({
                href: `https://github.com/${user.github}`,
                text: `@${user.github}`
              })
            : noValue
        },
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

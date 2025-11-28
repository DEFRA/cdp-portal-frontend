import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderComponent } from '../../common/helpers/nunjucks/render-component.js'
import { buildList } from '../../common/helpers/view/build-list.js'
import { noValue } from '../../common/constants/no-value.js'

function transformUserProfileToSummary(user) {
  const teams = user?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) =>
      buildLink({
        href: `/teams/${team.teamId}`,
        text: team.name,
        newTab: false
      })
    )

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
          html: buildLink({
            href: `mailto:${user.email}`,
            text: user.email
          })
        }
      },
      {
        key: { text: 'Github handle' },
        value: {
          html: buildLink({
            href: `https://github.com/${user.github}`,
            text: user.github
          })
        }
      },
      {
        key: { text: 'User type' },
        value: {
          text: user?.isAdmin ? 'Admin' : 'Tenant'
        }
      },
      {
        key: { text: `Team${teams?.length > 1 ? 's' : ''}` },
        value: {
          html: teams?.length ? buildList({ items: teams }) : noValue
        }
      },
      {
        key: { text: 'Has break glass' },
        value: {
          text: user.hasBreakGlass ? 'Yes' : 'No'
        }
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

export { transformUserProfileToSummary }

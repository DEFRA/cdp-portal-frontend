import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'

function transformRepositoryToSummary(repository) {
  const teams = repository?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => buildLink(`/teams/${team.teamId}`, team.name, false))

  const topics = repository?.topics.map((topic) =>
    renderComponent('tag', {
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    }).trim()
  )

  return {
    classes: 'app-summary-list',
    rows: [
      {
        key: { text: 'GitHub Repository' },
        value: {
          html: buildLink(repository.url, repository.url)
        }
      },
      {
        key: { text: `Team${teams?.length > 1 ? 's' : ''}` },
        value: {
          html: teams?.length ? buildList(teams) : noValue
        }
      },
      {
        key: { text: 'Primary Language' },
        value: { text: repository.primaryLanguage ?? noValue }
      },
      {
        key: { text: 'Topics' },
        value: {
          html: topics.length ? topics.join(' ') : noValue
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: repository.createdAt })
        }
      }
    ]
  }
}

export { transformRepositoryToSummary }

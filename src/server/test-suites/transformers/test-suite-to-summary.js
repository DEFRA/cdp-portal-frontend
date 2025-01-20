import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'

function transformTestSuiteToSummary(testSuite) {
  const teams = testSuite?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => buildLink(`/teams/${team.teamId}`, team.name, false))

  const topics = testSuite?.topics?.map((topic) =>
    renderComponent('tag', {
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    }).trim()
  )

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-8',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: `Team${teams?.length > 1 ? 's' : ''}` },
        value: {
          html: teams?.length ? buildList(teams) : noValue
        }
      },
      {
        key: { text: 'Primary Language' },
        value: { text: testSuite.primaryLanguage ?? noValue }
      },
      {
        key: {
          text: 'GitHub Repository'
        },
        value: {
          html: buildLink(testSuite.githubUrl)
        }
      },
      {
        key: { text: 'Topics' },
        value: {
          html: topics?.length ? topics.join(' ') : noValue
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: testSuite.createdAt })
        }
      }
    ]
  }
}

export { transformTestSuiteToSummary }

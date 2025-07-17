import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'

function transformTestSuiteToSummary(testSuite, repo) {
  const teams = testSuite?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) =>
      buildLink({
        href: `/teams/${team.teamId}`,
        text: team.name,
        newTab: false
      })
    )

  const githubUrl = repo?.url ?? `https://github.com/DEFRA/${testSuite.name}`

  const subType = renderTag({
    text: testSuite.subType,
    newWindow: true,
    link: { classes: 'app-link--without-underline' },
    attributes: { 'data-testid': 'govuk-tag' }
  })

  return {
    classes: 'app-summary-list',
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
        value: { text: repo?.primaryLanguage ?? noValue }
      },
      {
        key: {
          text: 'GitHub Repository'
        },
        value: {
          html: buildLink({ href: githubUrl })
        }
      },
      {
        key: { text: 'Type' },
        value: {
          html: subType ?? noValue
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: testSuite.created })
        }
      }
    ]
  }
}

export { transformTestSuiteToSummary }

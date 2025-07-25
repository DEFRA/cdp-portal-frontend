import { noValue } from '../../../../../common/constants/no-value.js'
import { sortByEnv } from '../../../../../common/helpers/sort/sort-by-env.js'
import { renderTestSuiteTagHtml } from '../render-test-suite-tag-html.js'

function actions(serviceName, testRunName) {
  return ` <div>
             <a class="app-link app-link--underline"
                href="/services/${serviceName}/automations/test-runs/${testRunName}/update"
                data-testid="app-link">Update</a>
           </div>
           <div class="govuk-!-margin-left-1">
             <a class="app-link app-link--underline"
                href="/services/${serviceName}/automations/test-runs/${testRunName}/remove"
                data-testid="app-link">Remove</a>
           </div>`
}

function testSuiteToEntityRow({
  serviceName,
  environments = [],
  testSuiteRepos = []
}) {
  return ([testSuiteName, activeEnvironments]) => {
    const envs = environments
      .map((environmentName) => {
        const hasTestRun = activeEnvironments.includes(environmentName)
        return {
          headers: environmentName,
          entity: {
            kind: 'html',
            value: hasTestRun
              ? `<div class="app-check" data-testid="check-${environmentName}"></div>`
              : noValue
          }
        }
      })
      .sort(sortByEnv)
    const testSuiteRepository = testSuiteRepos.find(
      (repo) => repo.id === testSuiteName
    )
    const kind = renderTestSuiteTagHtml(testSuiteRepository?.topics)

    return {
      cells: [
        {
          headers: 'test-suite',
          entity: {
            kind: 'link',
            value: testSuiteName,
            url: `/test-suites/${testSuiteName}`
          }
        },
        {
          headers: 'kind',
          entity: { kind: 'html', value: kind }
        },
        ...envs,
        {
          headers: 'actions',
          entity: {
            kind: 'html',
            value: actions(serviceName, testSuiteName)
          }
        }
      ]
    }
  }
}

export { testSuiteToEntityRow }

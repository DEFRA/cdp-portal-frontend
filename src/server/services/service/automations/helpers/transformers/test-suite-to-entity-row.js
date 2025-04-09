import { noValue } from '~/src/server/common/constants/no-value.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { renderTestSuiteTagHtml } from '~/src/server/services/service/automations/helpers/render-test-suite-tag-html.js'

function actions(serviceName, testRunName) {
  return `<ul class="app-entity-table__actions-list">
           <li class="app-entity-table__actions-list-item">
             <a class="app-link app-link--underline"
                href="/services/${serviceName}/automations/test-runs/${testRunName}/update"
                data-testid="app-link">Update</a>
           </li>
           <li class="app-entity-table__actions-list-item">
             <a class="app-link app-link--underline"
                href="/services/${serviceName}/automations/test-runs/${testRunName}/remove"
                data-testid="app-link">Remove</a>
           </li>
          </ul>`
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
            value: hasTestRun ? `<div class="app-check"></div>` : noValue
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

/*
This will show a list of test suites that have artifacts
- currently the same data as listing services
 */
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { config } from '~/src/config'

import { fetchTestSuites } from '~/src/server/test-suites/helpers/fetchers'

const testSuiteListController = {
  handler: async (request, h) => {
    const testSuites = await fetchTestSuites()
    const entityRows = testSuites
      ?.sort(sortBy('serviceName', 'asc'))
      ?.map(transformTestSuiteToEntityRow)

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      heading: 'Test Suites',
      entityRows
    })
  }
}

function transformTestSuiteToEntityRow(testSuite) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: testSuite.serviceName,
      url: `/test-suite/${testSuite.serviceName}`
    },
    {
      kind: 'list',
      value: testSuite?.teams?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))
    },
    {
      kind: 'link',
      value: `${githubOrg}/${testSuite.serviceName}`,
      url: `https://github.com/${githubOrg}/${testSuite.serviceName}`,
      newWindow: true
    }
  ]
}

export { testSuiteListController }

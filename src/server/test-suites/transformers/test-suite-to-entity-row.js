import { config } from '~/src/config'

function transformTestSuiteToEntityRow(testSuite) {
  const githubOrg = config.get('githubOrg')
  const teams = testSuite?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return [
    {
      kind: 'link',
      value: testSuite.serviceName,
      url: `/test-suites/${testSuite.serviceName}`
    },
    {
      kind: 'group',
      value: teams?.length ? teams : null
    },
    {
      kind: 'text',
      value: testSuite.testType
    },
    {
      kind: 'link',
      value: `${githubOrg}/${testSuite.id}`,
      url: `https://github.com/${githubOrg}/${testSuite.id}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: testSuite.lastRun?.created
    }
  ]
}

export { transformTestSuiteToEntityRow }

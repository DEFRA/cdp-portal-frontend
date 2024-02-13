import { config } from '~/src/config'

function transformTestSuiteToEntityRow(testSuite) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: testSuite.serviceName,
      url: `/test-suites/${testSuite.serviceName}`
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
      kind: 'text',
      value: testSuite.primaryLanguage
    },
    {
      kind: 'link',
      value: `${githubOrg}/${testSuite.id}`,
      url: `https://github.com/${githubOrg}/${testSuite.id}`,
      newWindow: true
    },
    { kind: 'date', value: testSuite.createdAt }
  ]
}

export { transformTestSuiteToEntityRow }

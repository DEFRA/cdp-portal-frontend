function testSuiteToEntityDataList(testSuite) {
  return [
    {
      heading: 'GitHub Repository',
      entity: {
        kind: 'link',
        value: testSuite.serviceName,
        url: testSuite.githubUrl,
        newWindow: true
      }
    },
    {
      heading: `Team${testSuite?.teams?.length > 1 ? 's' : ''}`,
      entity: {
        kind: 'list',
        value: testSuite?.teams?.map((team) => ({
          kind: 'link',
          value: team.name,
          url: `/teams/${team.teamId}`
        }))
      }
    },
    ...(testSuite?.primaryLanguage
      ? [
          {
            heading: 'Language',
            entity: {
              kind: 'text',
              value: testSuite.primaryLanguage
            }
          }
        ]
      : []),
    {
      heading: 'Repository Created',
      entity: { kind: 'date', value: testSuite.createdAt }
    }
  ]
}

export { testSuiteToEntityDataList }

import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function testSuiteToEntityDataList(testSuite) {
  return [
    {
      heading: 'Github Repository',
      entity: {
        kind: 'link',
        value: removeUrlParts(testSuite.githubUrl),
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
            heading: 'Type',
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

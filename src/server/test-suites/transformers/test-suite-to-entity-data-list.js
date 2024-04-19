import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function testSuiteToEntityDataList(testSuite) {
  return [
    {
      heading: 'GitHub Repository',
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
            heading: 'Language',
            entity: {
              kind: 'text',
              value: testSuite.primaryLanguage
            }
          }
        ]
      : []),
    ...(testSuite?.topics?.length
      ? [
          {
            heading: 'Topics',
            entity: {
              kind: 'group',
              value: testSuite?.topics?.map((topic) => ({
                kind: 'tag',
                value: topic,
                classes: 'app-tag--lowercase',
                url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
                newWindow: true,
                link: {
                  classes: 'app-link-without-underline'
                }
              }))
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

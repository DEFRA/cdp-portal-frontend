import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function testSuitesToDetailedList(testSuites = []) {
  const doInclude = ['journey', 'performance']
  const items = testSuites.map((testSuite) => ({
    title: {
      html: buildLink(
        `/test-suites/${testSuite.serviceName}`,
        testSuite.serviceName,
        false
      )
    },
    info: {
      html: testSuite.topics
        ?.filter((topic) => doInclude.includes(topic))
        .sort()
        .map((topic) => renderTag(topic))
        .join('')
    }
  }))

  return {
    isInverse: true,
    items
  }
}

export { testSuitesToDetailedList }

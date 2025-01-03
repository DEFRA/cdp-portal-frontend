import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function testSuitesToDetailedList(testSuites = []) {
  const doNotInclude = [
    'cdp',
    'service',
    'test-suite',
    'frontend',
    'backend',
    'test'
  ]
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
        ?.filter((topic) => !doNotInclude.includes(topic))
        .sort()
        .map((topic) => renderTag(topic))
        .join('')
    }
  }))

  return {
    items
  }
}

export { testSuitesToDetailedList }

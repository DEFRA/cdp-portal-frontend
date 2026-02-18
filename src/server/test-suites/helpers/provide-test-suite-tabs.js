import { buildTab } from '../../common/patterns/entities/tabs/helpers/build-tab.js'

/**
 * Provides tabs for the service view based on user authentication.
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<symbol>}
 */
async function provideTestSuiteTabs(request, h) {
  const isAdmin = await request.userIsAdmin()
  const isTenant = await request.userIsTenant()
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    const testSuite = request.app.entity
    const testSuiteName = testSuite?.name
    const isServiceOwner = await request.userIsOwner(testSuite)

    response.source.context.tabDetails = {
      label: 'Test Suite tabs'
    }
    response.source.context.tabDetails.tabs = [
      {
        isActive: request.path === `/test-suites/${testSuiteName}`,
        url: request.routeLookup('test-suites/{serviceId}', {
          params: {
            serviceId: testSuiteName
          }
        }),
        label: 'About'
      }
    ]

    // TODO: Expand to isServiceOwner as well
    if (isAdmin) {
      buildTab(response, request, 'test-suites', 'automations', testSuiteName)
    }

    if (isAdmin || isTenant) {
      buildTab(response, request, 'test-suites', 'proxy', testSuiteName)
    } else {
      response.source.context.tabDetails.displayTabs = false
    }

    if (isAdmin || isServiceOwner) {
      buildTab(response, request, 'test-suites', 'secrets', testSuiteName)
    }
  }

  return h.continue
}

export { provideTestSuiteTabs }

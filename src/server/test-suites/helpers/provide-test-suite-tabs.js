import { buildTab } from '~/src/server/common/patterns/entities/tabs/helpers/build-tab.js'

/**
 * Provides tabs for the service view based on user authentication.
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<symbol>}
 */
async function provideTestSuiteTabs(request, h) {
  const authedUser = await request.getUserSession()
  const isAdmin = authedUser?.isAdmin
  const isTenant = authedUser?.isTenant
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    const testSuite = response.source?.context.entity
    const testSuiteName = testSuite?.name
    const teams = testSuite?.teams ?? []
    const teamIds = teams.map((team) => team.teamId)
    const isServiceOwner = await request.userIsServiceOwner(teamIds)

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

import { fetchLibraries } from '../helpers/fetch/fetch-libraries.js'
import { provideAuthedUser } from '../../common/helpers/auth/pre/provide-authed-user.js'
import { buildUtilitiesTableData } from '../helpers/build-utilities-table-data.js'

const librariesListController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const libraries = await fetchLibraries()

    const rows = buildUtilitiesTableData({
      utilities: libraries,
      utilityType: 'libraries',
      isAuthenticated,
      userScopeUUIDs
    })
    const title = 'Libraries'

    return h.view('utilities/views/list', {
      pageTitle: title,
      pageHeading: {
        text: title,
        intro: 'Microservice and test-suite libraries'
      },
      tableData: {
        headers: [
          ...(isAuthenticated
            ? [{ id: 'owner', classes: 'app-entity-table__cell--owned' }]
            : []),
          { id: 'utility', text: 'Utility', width: '20' },
          { id: 'team', text: 'Team', width: '20' },
          { id: 'language', text: 'Language', width: '10' },
          { id: 'github-repository', text: 'GitHub Repository', width: '20' },
          { id: 'created', text: 'Created', width: '30' }
        ],
        rows,
        noResult: 'No libraries found'
      }
    })
  }
}

export { librariesListController }

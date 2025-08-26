import { fetchLibraries } from '../helpers/fetch/fetch-libraries.js'
import { buildUtilitiesTableData } from '../helpers/build-utilities-table-data.js'

const librariesListController = {
  handler: async (request, h) => {
    const userSession = await request.getUserSession()
    const isAuthenticated = userSession?.isAuthenticated
    const userScopes = userSession?.scope ?? []

    const libraries = await fetchLibraries()

    const rows = buildUtilitiesTableData({
      utilities: libraries,
      utilityType: 'libraries',
      isAuthenticated,
      userScopes
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

import { fetchTemplates } from '../helpers/fetch/fetch-templates.js'
import { provideAuthedUser } from '../../common/helpers/auth/pre/provide-authed-user.js'
import { buildUtilitiesTableData } from '../helpers/build-utilities-table-data.js'

const templatesListController = {
  options: {
    id: 'utilities/templates',
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const templates = await fetchTemplates()

    const rows = buildUtilitiesTableData({
      utilities: templates,
      utilityType: 'templates',
      isAuthenticated,
      userScopeUUIDs
    })
    const title = 'Templates'

    return h.view('utilities/views/list', {
      pageTitle: title,
      pageHeading: {
        text: title,
        intro: 'Microservice and test-suite templates'
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
        noResult: 'No templates found'
      }
    })
  }
}

export { templatesListController }

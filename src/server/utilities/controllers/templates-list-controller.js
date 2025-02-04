import { fetchTemplates } from '~/src/server/utilities/helpers/fetch/fetch-templates.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { buildUtilitiesTableData } from '~/src/server/utilities/helpers/build-utilities-table-data.js'

const templatesListController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const { repositories: templates } = await fetchTemplates()

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
            ? [
                {
                  id: 'owner',
                  text: 'Owner',
                  isHidden: true,
                  classes: 'app-entity-table__cell--owned'
                }
              ]
            : []),
          { id: 'utility', text: 'Utility', width: '20' },
          { id: 'team', text: 'Team', width: '15' },
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

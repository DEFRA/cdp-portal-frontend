import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { fetchRunningServices } from '../helpers/fetch-running-services.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { buildApisTableRows } from '../helpers/build-apis-table-rows.js'

const apisListController = {
  options: {
    id: 'apis'
  },
  handler: async (request, h) => {
    const userScopes = request.auth.credentials?.scope ?? []
    const environments = getEnvironments(userScopes)

    const [services, allRunningServices] = await Promise.all([
      fetchServices(),
      fetchRunningServices(environments)
    ])

    const rows = buildApisTableRows({
      services,
      runningServices: allRunningServices,
      environments
    })

    return h.view('apis/views/list', {
      pageTitle: 'APIs',
      environments,
      rows
    })
  }
}

export { apisListController }

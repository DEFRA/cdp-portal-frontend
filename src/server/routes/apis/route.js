import { fetchServices } from '#server/common/helpers/fetch/fetch-entities.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { buildApisTableRows } from '#server/apis/helpers/build-apis-table-rows.js'
import { fetchRunningServices } from '#server/apis/helpers/fetch-running-services.js'

export const options = {
  id: 'apis'
}

export default async function (request, h) {
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

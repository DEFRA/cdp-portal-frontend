import { config } from '~/src/config/config.js'

async function editTeam(request, teamId, payload) {
  const endpoint = config.get('userServiceBackendUrl') + '/teams/' + teamId

  const { data, response } = await request.authedFetcher(endpoint, {
    method: 'patch',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      serviceCodes: payload.serviceCodes,
      alertEmailAddresses: payload.alertEmailAddresses,
      github: payload.github
    })
  })

  return { data, response }
}

export { editTeam }

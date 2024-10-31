import { config } from '~/src/config/index.js'

async function editTeam(request, teamId, payload) {
  const endpoint = config.get('userServiceBackendUrl') + '/teams/' + teamId

  const { json, response } = await request.authedFetcher(endpoint, {
    method: 'patch',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      serviceCodes: payload.serviceCodes,
      github: payload.github
    })
  })

  return { json, response }
}

export { editTeam }

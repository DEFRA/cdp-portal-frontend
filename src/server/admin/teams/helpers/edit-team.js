import { config } from '~/src/config'

async function editTeam(request, teamId, payload) {
  const editTeamEndpointUrl =
    config.get('userServiceApiUrl') + '/teams/' + teamId

  const response = await request.fetchWithAuth(editTeamEndpointUrl, {
    method: 'patch',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      github: payload.github
    })
  })

  return response
}

export { editTeam }

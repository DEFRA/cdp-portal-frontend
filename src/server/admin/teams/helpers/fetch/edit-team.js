import { config } from '~/src/config'

async function editTeam(request, teamId, payload) {
  const editTeamEndpointUrl =
    config.get('userServiceApiUrl') + '/teams/' + teamId

  return await request.fetchWithAuth(editTeamEndpointUrl, {
    method: 'patch',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      github: payload.github
    })
  })
}

export { editTeam }

import { config } from '~/src/config'

async function editTeam(request, teamId, payload) {
  const endpoint = config.get('userServiceApiUrl') + '/teams/' + teamId

  const { json } = await request.authedFetcher(endpoint, {
    method: 'patch',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      github: payload.github
    })
  })

  return json
}

export { editTeam }

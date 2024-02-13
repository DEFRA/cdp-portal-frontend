import { config } from '~/src/config'

async function addMemberToTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceApiUrl') + `/teams/${teamId}/add/${userId}`

  const { json } = await request.authedFetcher(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return json
}

export { addMemberToTeam }

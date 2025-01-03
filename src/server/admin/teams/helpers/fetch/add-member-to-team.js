import { config } from '~/src/config/config.js'

async function addMemberToTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceBackendUrl') + `/teams/${teamId}/add/${userId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return data
}

export { addMemberToTeam }

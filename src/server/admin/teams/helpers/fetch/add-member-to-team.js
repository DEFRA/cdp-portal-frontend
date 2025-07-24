import { config } from '../../../../../config/config.js'

async function addMemberToTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceBackendUrl') + `/teams/${teamId}/add/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

export { addMemberToTeam }

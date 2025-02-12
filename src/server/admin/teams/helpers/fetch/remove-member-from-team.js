import { config } from '~/src/config/config.js'

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceBackendUrl') + `/teams/${teamId}/remove/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })
  return payload
}

export { removeMemberFromTeam }

import { config } from '~/src/config/index.js'

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceBackendUrl') + `/teams/${teamId}/remove/${userId}`

  const { json } = await request.authedFetcher(endpoint, {
    method: 'patch'
  })
  return json
}

export { removeMemberFromTeam }

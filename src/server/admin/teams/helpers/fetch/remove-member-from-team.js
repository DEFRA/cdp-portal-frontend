import { config } from '~/src/config/config.js'

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceBackendUrl') + `/teams/${teamId}/remove/${userId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch'
  })
  return data
}

export { removeMemberFromTeam }

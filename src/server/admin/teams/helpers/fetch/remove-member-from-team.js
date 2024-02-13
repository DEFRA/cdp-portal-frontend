import { config } from '~/src/config'

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`

  const { json } = await request.authedFetcher(endpoint, {
    method: 'patch'
  })
  return json
}

export { removeMemberFromTeam }

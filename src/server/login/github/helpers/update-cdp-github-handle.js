import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

const editUserEndpointPrefix = `${config.get('userServiceApiUrl')}/users/`

async function updateCdpUserGithubHandle(request, user, githubHandle) {
  request.logger.debug({ user, githubHandle }, 'Updating user github handle')
  const editUserEndpointUrl = `${editUserEndpointPrefix}${user.userId}/github`
  try {
    const body = JSON.stringify({
      github: githubHandle
    })
    const { response } = await fetcher(editUserEndpointUrl, {
      method: 'patch',
      body
    })
    if (!response.ok) {
      throw new Error({ response }, 'Failed to update user github handle')
    }
  } catch (error) {
    request.logger.error(
      { error },
      'Failed to update user github handle in CDP'
    )
    throw new Error('Failed to update user github handle')
  }
}

export { updateCdpUserGithubHandle }

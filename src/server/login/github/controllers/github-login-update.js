import Joi from 'joi'
import Boom from '@hapi/boom'
import { removeAuthenticatedUser } from '~/src/server/common/helpers/auth/user-session'
import { updateCdpUserGithubHandle } from '~/src/server/login/github/helpers/update-cdp-github-handle'

const githubLoginUpdateController = {
  options: {
    validate: {
      payload: Joi.object({
        githubCode: Joi.string().required(),
        githubHandle: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { githubHandle } = request.payload
    request.logger.debug(
      { githubHandle, payload: request.payload },
      'GitHub handle update'
    )

    const authedUser = await request.getUserSession()
    if (!authedUser?.id) {
      throw new Error('User not authenticated')
    }
    const { user } = await request.server.methods.fetchCdpUser(authedUser.id)
    if (user.github) {
      throw new Error('Already have a github handle')
    }

    await updateCdpUserGithubHandle(request, user, githubHandle)

    await removeAuthenticatedUser(request)

    const redirect = '/login'

    return h.redirect(redirect)
  }
}

export { githubLoginUpdateController }

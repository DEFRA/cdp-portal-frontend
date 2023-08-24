import Joi from 'joi'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchUser } from '~/src/server/admin/users/helpers/fetch-user'

const startEditUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string().guid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { user } = await fetchUser(request.params?.userId)

    request.yar.set(sessionNames.cdpUser, {
      ...user,
      isEdit: true
    })
    request.yar.clear(sessionNames.validationFailure)

    return h.redirect(
      `${appConfig.get('appPathPrefix')}/admin/users/find-github-user${
        user?.github ? `?githubSearch=${user?.github}` : ''
      }`
    )
  }
}

export { startEditUserController }

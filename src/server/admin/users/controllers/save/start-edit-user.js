import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/form'

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
    request.yar.clear(sessionNames.cdpUser)
    request.yar.clear(sessionNames.validationFailure)

    const { user } = await fetchCdpUser(request.params?.userId)

    await saveToCdpUser(request, h, {
      ...user,
      isEdit: true
    })

    const queryString = qs.stringify(
      { ...(user?.github && { githubSearch: user?.github }) },
      { addQueryPrefix: true }
    )

    return h.redirect(`/admin/users/find-github-user${queryString}`)
  }
}

export { startEditUserController }

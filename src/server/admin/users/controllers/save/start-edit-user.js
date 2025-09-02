import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { fetchCdpUser } from '../../helpers/fetch/index.js'
import { saveToCdpUser } from '../../helpers/form/index.js'
import { userIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const startEditUserController = {
  options: {
    id: 'admin/users/{userId}/edit',
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.cdpUser)
    request.yar.clear(sessionNames.validationFailure)

    const user = await fetchCdpUser(request.params?.userId)

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

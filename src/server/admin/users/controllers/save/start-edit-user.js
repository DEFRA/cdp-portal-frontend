import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { fetchCdpUser } from '../../helpers/fetch/fetchers.js'
import { userIdValidation } from '@defra/cdp-validation-kit'

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
    const multiStepFormId = request.app.multiStepFormId
    request.yar.clear(sessionNames.validationFailure)

    const user = await fetchCdpUser(request.params?.userId)

    await request.app.saveStepData(
      multiStepFormId,
      { ...user, isEdit: true },
      h
    )

    const queryString = qs.stringify(
      { ...(user?.github && { githubSearch: user?.github }) },
      { addQueryPrefix: true }
    )

    return h.redirect(
      `/admin/users/find-github-user/${multiStepFormId}${queryString}`
    )
  }
}

export { startEditUserController }

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
    request.yar.clear(sessionNames.validationFailure)

    const user = await fetchCdpUser(request.params?.userId)

    return h.view('admin/users/views/edit/edit-user-form', {
      user,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: user.name,
          href: `/admin/users/${user.userId}`
        },
        {
          text: 'Edit'
        }
      ]
    })
  }
}

export { startEditUserController }
